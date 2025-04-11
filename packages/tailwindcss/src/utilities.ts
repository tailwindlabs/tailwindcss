import {
  atRoot,
  atRule,
  decl,
  rule,
  styleRule,
  walk,
  type AstNode,
  type AtRule,
  type Declaration,
  type Rule,
} from './ast'
import type { Candidate, CandidateModifier, NamedUtilityValue } from './candidate'
import type { DesignSystem } from './design-system'
import type { Theme, ThemeKey } from './theme'
import { compareBreakpoints } from './utils/compare-breakpoints'
import { DefaultMap } from './utils/default-map'
import {
  inferDataType,
  isPositiveInteger,
  isStrictPositiveInteger,
  isValidOpacityValue,
  isValidSpacingMultiplier,
} from './utils/infer-data-type'
import { replaceShadowColors } from './utils/replace-shadow-colors'
import { segment } from './utils/segment'
import * as ValueParser from './value-parser'

const IS_VALID_STATIC_UTILITY_NAME = /^-?[a-z][a-zA-Z0-9/%._-]*$/
const IS_VALID_FUNCTIONAL_UTILITY_NAME = /^-?[a-z][a-zA-Z0-9/%._-]*-\*$/

const DEFAULT_SPACING_SUGGESTIONS = [
  '0',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '44',
  '48',
  '52',
  '56',
  '60',
  '64',
  '72',
  '80',
  '96',
]

type CompileFn<T extends Candidate['kind']> = (
  value: Extract<Candidate, { kind: T }>,
) => AstNode[] | undefined | null

interface SuggestionGroup {
  supportsNegative?: boolean
  values: (string | null)[]
  modifiers: string[]
}

type SuggestionDefinition =
  | string
  | {
      supportsNegative?: boolean
      supportsFractions?: boolean
      values?: string[]
      modifiers?: string[]
      valueThemeKeys?: ThemeKey[]
      modifierThemeKeys?: ThemeKey[]
      hasDefaultValue?: boolean
    }

export type UtilityOptions = {
  types: string[]
}

export type Utility = {
  kind: 'static' | 'functional'
  compileFn: CompileFn<any>
  options?: UtilityOptions
}

export class Utilities {
  private utilities = new DefaultMap<string, Utility[]>(() => [])

  private completions = new Map<string, () => SuggestionGroup[]>()

  static(name: string, compileFn: CompileFn<'static'>) {
    this.utilities.get(name).push({ kind: 'static', compileFn })
  }

  functional(name: string, compileFn: CompileFn<'functional'>, options?: UtilityOptions) {
    this.utilities.get(name).push({ kind: 'functional', compileFn, options })
  }

  has(name: string, kind: 'static' | 'functional') {
    return this.utilities.has(name) && this.utilities.get(name).some((fn) => fn.kind === kind)
  }

  get(name: string) {
    return this.utilities.has(name) ? this.utilities.get(name) : []
  }

  getCompletions(name: string): SuggestionGroup[] {
    return this.completions.get(name)?.() ?? []
  }

  suggest(name: string, groups: () => SuggestionGroup[]) {
    // TODO: We are calling this multiple times on purpose but ideally only ever
    // once per utility root.
    this.completions.set(name, groups)
  }

  keys(kind: 'static' | 'functional') {
    let keys: string[] = []

    for (let [key, fns] of this.utilities.entries()) {
      for (let fn of fns) {
        if (fn.kind === kind) {
          keys.push(key)
          break
        }
      }
    }

    return keys
  }
}

function property(ident: string, initialValue?: string, syntax?: string) {
  return atRule('@property', ident, [
    decl('syntax', syntax ? `"${syntax}"` : `"*"`),
    decl('inherits', 'false'),

    // If there's no initial value, it's important that we omit it rather than
    // use an empty value. Safari currently doesn't support an empty
    // `initial-value` properly, so we have to design how we use things around
    // the guaranteed invalid value instead, which is how `initial-value`
    // behaves when omitted.
    ...(initialValue ? [decl('initial-value', initialValue)] : []),
  ])
}

/**
 * Apply opacity to a color using `color-mix`.
 */
export function withAlpha(value: string, alpha: string): string {
  if (alpha === null) return value

  // Convert numeric values (like `0.5`) to percentages (like `50%`) so they
  // work properly with `color-mix`. Assume anything that isn't a number is
  // safe to pass through as-is, like `var(--my-opacity)`.
  let alphaAsNumber = Number(alpha)
  if (!Number.isNaN(alphaAsNumber)) {
    alpha = `${alphaAsNumber * 100}%`
  }

  return `color-mix(in oklab, ${value} ${alpha}, transparent)`
}

/**
 * Apply opacity to a color using `color-mix`.
 */
export function replaceAlpha(value: string, alpha: string): string {
  // Convert numeric values (like `0.5`) to percentages (like `50%`) so they
  // work properly with `color-mix`. Assume anything that isn't a number is
  // safe to pass through as-is, like `var(--my-opacity)`.
  let alphaAsNumber = Number(alpha)
  if (!Number.isNaN(alphaAsNumber)) {
    alpha = `${alphaAsNumber * 100}%`
  }

  return `oklab(from ${value} l a b / ${alpha})`
}

/**
 * Resolve a color value + optional opacity modifier to a final color.
 */
export function asColor(
  value: string,
  modifier: CandidateModifier | null,
  theme: Theme,
): string | null {
  if (!modifier) return value

  if (modifier.kind === 'arbitrary') {
    return withAlpha(value, modifier.value)
  }

  // Check if the modifier exists in the `opacity` theme configuration and use
  // that value if so.
  let alpha = theme.resolve(modifier.value, ['--opacity'])
  if (alpha) {
    return withAlpha(value, alpha)
  }

  if (!isValidOpacityValue(modifier.value)) {
    return null
  }

  // The modifier is a bare value like `50`, so convert that to `50%`.
  return withAlpha(value, `${modifier.value}%`)
}

/**
 * Finds a color in the theme under one of the given theme keys that matches
 * `candidateValue`.
 *
 * The values `inherit`, `transparent` and `current` are special-cased as they
 * are universal and don't need to be resolved from the theme.
 */
function resolveThemeColor<T extends ThemeKey>(
  candidate: Extract<Candidate, { kind: 'functional' }>,
  theme: Theme,
  themeKeys: T[],
) {
  if (process.env.NODE_ENV === 'test') {
    if (!candidate.value) {
      throw new Error('resolveThemeColor must be called with a named candidate')
    }

    if (candidate.value.kind !== 'named') {
      throw new Error('resolveThemeColor must be called with a named value')
    }
  }

  let value: string | null = null

  switch (candidate.value!.value) {
    case 'inherit': {
      value = 'inherit'
      break
    }
    case 'transparent': {
      value = 'transparent'
      break
    }
    case 'current': {
      value = 'currentcolor'
      break
    }
    default: {
      value = theme.resolve(candidate.value!.value, themeKeys)
      break
    }
  }

  return value ? asColor(value, candidate.modifier, theme) : null
}

export function createUtilities(theme: Theme) {
  let utilities = new Utilities()

  /**
   * Register list of suggestions for a class
   */
  function suggest(classRoot: string, defns: () => SuggestionDefinition[]) {
    /**
     * The alpha and beta releases used `_` in theme keys to represent a `.`. This meant we used
     * `--leading-1_5` instead of `--leading-1\.5` to add utilities like `leading-1.5`.
     *
     * We prefer the use of the escaped dot now but still want to make sure suggestions for the
     * legacy key format still works as expected when surrounded by numbers.
     */
    const LEGACY_NUMERIC_KEY = /(\d+)_(\d+)/g

    function* resolve(themeKeys: ThemeKey[]) {
      for (let value of theme.keysInNamespaces(themeKeys)) {
        yield value.replace(LEGACY_NUMERIC_KEY, (_, a, b) => {
          return `${a}.${b}`
        })
      }
    }

    let suggestedFractions = [
      '1/2',
      '1/3',
      '2/3',
      '1/4',
      '2/4',
      '3/4',
      '1/5',
      '2/5',
      '3/5',
      '4/5',
      '1/6',
      '2/6',
      '3/6',
      '4/6',
      '5/6',
      '1/12',
      '2/12',
      '3/12',
      '4/12',
      '5/12',
      '6/12',
      '7/12',
      '8/12',
      '9/12',
      '10/12',
      '11/12',
    ]

    utilities.suggest(classRoot, () => {
      let groups: SuggestionGroup[] = []

      for (let defn of defns()) {
        if (typeof defn === 'string') {
          groups.push({ values: [defn], modifiers: [] })
          continue
        }

        let values: (string | null)[] = [
          ...(defn.values ?? []),
          ...resolve(defn.valueThemeKeys ?? []),
        ]

        let modifiers = [...(defn.modifiers ?? []), ...resolve(defn.modifierThemeKeys ?? [])]

        if (defn.supportsFractions) {
          values.push(...suggestedFractions)
        }

        if (defn.hasDefaultValue) {
          values.unshift(null)
        }

        groups.push({ supportsNegative: defn.supportsNegative, values, modifiers })
      }

      return groups
    })
  }

  /**
   * Register a static utility class like `justify-center`.
   */
  function staticUtility(className: string, declarations: ([string, string] | (() => AstNode))[]) {
    utilities.static(className, () => {
      return declarations.map((node) => {
        return typeof node === 'function' ? node() : decl(node[0], node[1])
      })
    })
  }

  type UtilityDescription = {
    supportsNegative?: boolean
    supportsFractions?: boolean
    themeKeys?: ThemeKey[]
    defaultValue?: string | null
    handleBareValue?: (value: NamedUtilityValue) => string | null
    handleNegativeBareValue?: (value: NamedUtilityValue) => string | null
    handle: (value: string, dataType: string | null) => AstNode[] | undefined
  }

  /**
   * Register a functional utility class like `max-w-*` that maps to tokens in the
   * user's theme.
   */
  function functionalUtility(classRoot: string, desc: UtilityDescription) {
    function handleFunctionalUtility({ negative }: { negative: boolean }) {
      return (candidate: Extract<Candidate, { kind: 'functional' }>) => {
        let value: string | null = null
        let dataType: string | null = null

        if (!candidate.value) {
          if (candidate.modifier) return

          // If the candidate has no value segment (like `rounded`), use the
          // `defaultValue` (for candidates like `grow` that have no theme
          // values) or a bare theme value (like `--radius` for `rounded`). No
          // utility will ever support both of these.
          value =
            desc.defaultValue !== undefined
              ? desc.defaultValue
              : theme.resolve(null, desc.themeKeys ?? [])
        } else if (candidate.value.kind === 'arbitrary') {
          if (candidate.modifier) return
          value = candidate.value.value
          dataType = candidate.value.dataType
        } else {
          value = theme.resolve(
            candidate.value.fraction ?? candidate.value.value,
            desc.themeKeys ?? [],
          )

          // Automatically handle things like `w-1/2` without requiring `1/2` to
          // exist as a theme value.
          if (value === null && desc.supportsFractions && candidate.value.fraction) {
            let [lhs, rhs] = segment(candidate.value.fraction, '/')
            if (!isPositiveInteger(lhs) || !isPositiveInteger(rhs)) return
            value = `calc(${candidate.value.fraction} * 100%)`
          }

          // If there is still no value but the utility supports bare values,
          // then use the bare candidate value as the value.
          if (value === null && negative && desc.handleNegativeBareValue) {
            value = desc.handleNegativeBareValue(candidate.value)
            if (!value?.includes('/') && candidate.modifier) return
            if (value !== null) return desc.handle(value, null)
          }

          if (value === null && desc.handleBareValue) {
            value = desc.handleBareValue(candidate.value)
            if (!value?.includes('/') && candidate.modifier) return
          }
        }

        // If there is no value, don't generate any rules.
        if (value === null) return

        // Negate the value if the candidate has a negative prefix.
        return desc.handle(negative ? `calc(${value} * -1)` : value, dataType)
      }
    }

    if (desc.supportsNegative) {
      utilities.functional(`-${classRoot}`, handleFunctionalUtility({ negative: true }))
    }
    utilities.functional(classRoot, handleFunctionalUtility({ negative: false }))

    suggest(classRoot, () => [
      {
        supportsNegative: desc.supportsNegative,
        valueThemeKeys: desc.themeKeys ?? [],
        hasDefaultValue: desc.defaultValue !== undefined && desc.defaultValue !== null,
        supportsFractions: desc.supportsFractions,
      },
    ])
  }

  type ColorUtilityDescription = {
    themeKeys: ThemeKey[]
    handle: (value: string) => AstNode[] | undefined
  }

  /**
   * Register a functional utility class that represents a color.
   * Such utilities gain automatic support for color opacity modifiers.
   */
  function colorUtility(classRoot: string, desc: ColorUtilityDescription) {
    utilities.functional(classRoot, (candidate) => {
      // Color utilities have to have a value, like the `red-500` in
      // `bg-red-500`, otherwise they would be static utilities.
      if (!candidate.value) return

      // Find the actual CSS value that the candidate value maps to.
      let value: string | null = null

      if (candidate.value.kind === 'arbitrary') {
        value = candidate.value.value

        // Apply an opacity modifier to the value if appropriate.
        value = asColor(value, candidate.modifier, theme)
      } else {
        value = resolveThemeColor(candidate, theme, desc.themeKeys)
      }

      // If the candidate value (like the `red-500` in `bg-red-500`) doesn't
      // resolve to an actual value, don't generate any rules.
      if (value === null) return

      return desc.handle(value)
    })

    suggest(classRoot, () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: desc.themeKeys,
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
    ])
  }

  function spacingUtility(
    name: string,
    themeKeys: ThemeKey[],
    handle: (value: string) => AstNode[] | undefined,
    {
      supportsNegative = false,
      supportsFractions = false,
    }: {
      supportsNegative?: boolean
      supportsFractions?: boolean
    } = {},
  ) {
    if (supportsNegative) {
      utilities.static(`-${name}-px`, () => handle('-1px'))
    }
    utilities.static(`${name}-px`, () => handle('1px'))
    functionalUtility(name, {
      themeKeys,
      supportsFractions,
      supportsNegative,
      defaultValue: null,
      handleBareValue: ({ value }) => {
        let multiplier = theme.resolve(null, ['--spacing'])
        if (!multiplier) return null
        if (!isValidSpacingMultiplier(value)) return null

        return `calc(${multiplier} * ${value})`
      },
      handleNegativeBareValue: ({ value }) => {
        let multiplier = theme.resolve(null, ['--spacing'])
        if (!multiplier) return null
        if (!isValidSpacingMultiplier(value)) return null

        return `calc(${multiplier} * -${value})`
      },
      handle,
    })

    suggest(name, () => [
      {
        values: theme.get(['--spacing']) ? DEFAULT_SPACING_SUGGESTIONS : [],
        supportsNegative,
        supportsFractions,
        valueThemeKeys: themeKeys,
      },
    ])
  }

  /**
   * ----------------
   * Utility matchers
   * ----------------
   */

  staticUtility('sr-only', [
    ['position', 'absolute'],
    ['width', '1px'],
    ['height', '1px'],
    ['padding', '0'],
    ['margin', '-1px'],
    ['overflow', 'hidden'],
    ['clip', 'rect(0, 0, 0, 0)'],
    ['white-space', 'nowrap'],
    ['border-width', '0'],
  ])
  staticUtility('not-sr-only', [
    ['position', 'static'],
    ['width', 'auto'],
    ['height', 'auto'],
    ['padding', '0'],
    ['margin', '0'],
    ['overflow', 'visible'],
    ['clip', 'auto'],
    ['white-space', 'normal'],
  ])

  /**
   * @css `pointer-events`
   */
  staticUtility('pointer-events-none', [['pointer-events', 'none']])
  staticUtility('pointer-events-auto', [['pointer-events', 'auto']])

  /**
   * @css `visibility`
   */
  staticUtility('visible', [['visibility', 'visible']])
  staticUtility('invisible', [['visibility', 'hidden']])
  staticUtility('collapse', [['visibility', 'collapse']])

  /**
   * @css `position`
   */
  staticUtility('static', [['position', 'static']])
  staticUtility('fixed', [['position', 'fixed']])
  staticUtility('absolute', [['position', 'absolute']])
  staticUtility('relative', [['position', 'relative']])
  staticUtility('sticky', [['position', 'sticky']])

  /**
   * @css `inset`
   */
  for (let [name, property] of [
    ['inset', 'inset'],
    ['inset-x', 'inset-inline'],
    ['inset-y', 'inset-block'],
    ['start', 'inset-inline-start'],
    ['end', 'inset-inline-end'],
    ['top', 'top'],
    ['right', 'right'],
    ['bottom', 'bottom'],
    ['left', 'left'],
  ] as const) {
    staticUtility(`${name}-auto`, [[property, 'auto']])
    staticUtility(`${name}-full`, [[property, '100%']])
    staticUtility(`-${name}-full`, [[property, '-100%']])
    spacingUtility(name, ['--inset', '--spacing'], (value) => [decl(property, value)], {
      supportsNegative: true,
      supportsFractions: true,
    })
  }

  /**
   * @css `isolation`
   */
  staticUtility('isolate', [['isolation', 'isolate']])
  staticUtility('isolation-auto', [['isolation', 'auto']])

  /**
   * @css `z-index`
   */
  staticUtility('z-auto', [['z-index', 'auto']])
  functionalUtility('z', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--z-index'],
    handle: (value) => [decl('z-index', value)],
  })

  suggest('z', () => [
    {
      supportsNegative: true,
      values: ['0', '10', '20', '30', '40', '50'],
      valueThemeKeys: ['--z-index'],
    },
  ])

  /**
   * @css `order`
   */
  staticUtility('order-first', [['order', '-9999']])
  staticUtility('order-last', [['order', '9999']])
  staticUtility('order-none', [['order', '0']])
  functionalUtility('order', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--order'],
    handle: (value) => [decl('order', value)],
  })

  suggest('order', () => [
    {
      supportsNegative: true,
      values: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--order'],
    },
  ])

  /**
   * @css `grid-column`
   */
  staticUtility('col-auto', [['grid-column', 'auto']])
  functionalUtility('col', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--grid-column'],
    handle: (value) => [decl('grid-column', value)],
  })
  staticUtility('col-span-full', [['grid-column', '1 / -1']])
  functionalUtility('col-span', {
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    handle: (value) => [decl('grid-column', `span ${value} / span ${value}`)],
  })

  /**
   * @css `grid-column-start`
   */
  staticUtility('col-start-auto', [['grid-column-start', 'auto']])
  functionalUtility('col-start', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--grid-column-start'],
    handle: (value) => [decl('grid-column-start', value)],
  })

  /**
   * @css `grid-column-end`
   */
  staticUtility('col-end-auto', [['grid-column-end', 'auto']])
  functionalUtility('col-end', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--grid-column-end'],
    handle: (value) => [decl('grid-column-end', value)],
  })

  suggest('col-span', () => [
    {
      values: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      valueThemeKeys: [],
    },
  ])

  suggest('col-start', () => [
    {
      supportsNegative: true,
      values: Array.from({ length: 13 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--grid-column-start'],
    },
  ])

  suggest('col-end', () => [
    {
      supportsNegative: true,
      values: Array.from({ length: 13 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--grid-column-end'],
    },
  ])

  /**
   * @css `grid-row`
   */
  staticUtility('row-auto', [['grid-row', 'auto']])
  functionalUtility('row', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--grid-row'],
    handle: (value) => [decl('grid-row', value)],
  })
  staticUtility('row-span-full', [['grid-row', '1 / -1']])
  functionalUtility('row-span', {
    themeKeys: [],
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    handle: (value) => [decl('grid-row', `span ${value} / span ${value}`)],
  })

  /**
   * @css `grid-row-start`
   */
  staticUtility('row-start-auto', [['grid-row-start', 'auto']])
  functionalUtility('row-start', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--grid-row-start'],
    handle: (value) => [decl('grid-row-start', value)],
  })

  /**
   * @css `grid-row-end`
   */
  staticUtility('row-end-auto', [['grid-row-end', 'auto']])
  functionalUtility('row-end', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    themeKeys: ['--grid-row-end'],
    handle: (value) => [decl('grid-row-end', value)],
  })

  suggest('row-span', () => [
    {
      values: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      valueThemeKeys: [],
    },
  ])

  suggest('row-start', () => [
    {
      supportsNegative: true,
      values: Array.from({ length: 13 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--grid-row-start'],
    },
  ])

  suggest('row-end', () => [
    {
      supportsNegative: true,
      values: Array.from({ length: 13 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--grid-row-end'],
    },
  ])

  /**
   * @css `float`
   */
  staticUtility('float-start', [['float', 'inline-start']])
  staticUtility('float-end', [['float', 'inline-end']])
  staticUtility('float-right', [['float', 'right']])
  staticUtility('float-left', [['float', 'left']])
  staticUtility('float-none', [['float', 'none']])

  /**
   * @css `clear`
   */
  staticUtility('clear-start', [['clear', 'inline-start']])
  staticUtility('clear-end', [['clear', 'inline-end']])
  staticUtility('clear-right', [['clear', 'right']])
  staticUtility('clear-left', [['clear', 'left']])
  staticUtility('clear-both', [['clear', 'both']])
  staticUtility('clear-none', [['clear', 'none']])

  /**
   * @css `margin`
   */
  for (let [namespace, property] of [
    ['m', 'margin'],
    ['mx', 'margin-inline'],
    ['my', 'margin-block'],
    ['ms', 'margin-inline-start'],
    ['me', 'margin-inline-end'],
    ['mt', 'margin-top'],
    ['mr', 'margin-right'],
    ['mb', 'margin-bottom'],
    ['ml', 'margin-left'],
  ] as const) {
    staticUtility(`${namespace}-auto`, [[property, 'auto']])
    spacingUtility(namespace, ['--margin', '--spacing'], (value) => [decl(property, value)], {
      supportsNegative: true,
    })
  }

  /**
   * @css `box-sizing`
   */
  staticUtility('box-border', [['box-sizing', 'border-box']])
  staticUtility('box-content', [['box-sizing', 'content-box']])

  /**
   * @css `line-clamp`
   */
  staticUtility('line-clamp-none', [
    ['overflow', 'visible'],
    ['display', 'block'],
    ['-webkit-box-orient', 'horizontal'],
    ['-webkit-line-clamp', 'unset'],
  ])
  functionalUtility('line-clamp', {
    themeKeys: ['--line-clamp'],
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    handle: (value) => [
      decl('overflow', 'hidden'),
      decl('display', '-webkit-box'),
      decl('-webkit-box-orient', 'vertical'),
      decl('-webkit-line-clamp', value),
    ],
  })

  suggest('line-clamp', () => [
    {
      values: ['1', '2', '3', '4', '5', '6'],
      valueThemeKeys: ['--line-clamp'],
    },
  ])

  /**
   * @css `display`
   */
  staticUtility('block', [['display', 'block']])
  staticUtility('inline-block', [['display', 'inline-block']])
  staticUtility('inline', [['display', 'inline']])
  staticUtility('hidden', [['display', 'none']])
  // flex is registered below
  staticUtility('inline-flex', [['display', 'inline-flex']])
  staticUtility('table', [['display', 'table']])
  staticUtility('inline-table', [['display', 'inline-table']])
  staticUtility('table-caption', [['display', 'table-caption']])
  staticUtility('table-cell', [['display', 'table-cell']])
  staticUtility('table-column', [['display', 'table-column']])
  staticUtility('table-column-group', [['display', 'table-column-group']])
  staticUtility('table-footer-group', [['display', 'table-footer-group']])
  staticUtility('table-header-group', [['display', 'table-header-group']])
  staticUtility('table-row-group', [['display', 'table-row-group']])
  staticUtility('table-row', [['display', 'table-row']])
  staticUtility('flow-root', [['display', 'flow-root']])
  staticUtility('flex', [['display', 'flex']])
  staticUtility('grid', [['display', 'grid']])
  staticUtility('inline-grid', [['display', 'inline-grid']])
  staticUtility('contents', [['display', 'contents']])
  staticUtility('list-item', [['display', 'list-item']])

  /**
   * @css `field-sizing`
   */
  staticUtility('field-sizing-content', [['field-sizing', 'content']])
  staticUtility('field-sizing-fixed', [['field-sizing', 'fixed']])

  /**
   * @css `aspect-ratio`
   */
  staticUtility('aspect-auto', [['aspect-ratio', 'auto']])
  staticUtility('aspect-square', [['aspect-ratio', '1 / 1']])
  functionalUtility('aspect', {
    themeKeys: ['--aspect'],
    handleBareValue: ({ fraction }) => {
      if (fraction === null) return null
      let [lhs, rhs] = segment(fraction, '/')
      if (!isPositiveInteger(lhs) || !isPositiveInteger(rhs)) return null
      return fraction
    },
    handle: (value) => [decl('aspect-ratio', value)],
  })

  /**
   * @css `size`
   * @css `width`
   * @css `min-width`
   * @css `max-width`
   * @css `height`
   * @css `min-height`
   * @css `max-height`
   */
  for (let [key, value] of [
    ['auto', 'auto'],
    ['full', '100%'],
    ['svw', '100svw'],
    ['lvw', '100lvw'],
    ['dvw', '100dvw'],
    ['svh', '100svh'],
    ['lvh', '100lvh'],
    ['dvh', '100dvh'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`size-${key}`, [
      ['--tw-sort', 'size'],
      ['width', value],
      ['height', value],
    ])
    staticUtility(`w-${key}`, [['width', value]])
    staticUtility(`h-${key}`, [['height', value]])
    staticUtility(`min-w-${key}`, [['min-width', value]])
    staticUtility(`min-h-${key}`, [['min-height', value]])
    if (key !== 'auto') {
      staticUtility(`max-w-${key}`, [['max-width', value]])
      staticUtility(`max-h-${key}`, [['max-height', value]])
    }
  }

  staticUtility(`w-screen`, [['width', '100vw']])
  staticUtility(`min-w-screen`, [['min-width', '100vw']])
  staticUtility(`max-w-screen`, [['max-width', '100vw']])
  staticUtility(`h-screen`, [['height', '100vh']])
  staticUtility(`min-h-screen`, [['min-height', '100vh']])
  staticUtility(`max-h-screen`, [['max-height', '100vh']])

  staticUtility(`max-w-none`, [['max-width', 'none']])
  staticUtility(`max-h-none`, [['max-height', 'none']])

  spacingUtility(
    'size',
    ['--size', '--spacing'],
    (value) => [decl('--tw-sort', 'size'), decl('width', value), decl('height', value)],
    {
      supportsFractions: true,
    },
  )

  for (let [name, namespaces, property] of [
    ['w', ['--width', '--spacing', '--container'], 'width'],
    ['min-w', ['--min-width', '--spacing', '--container'], 'min-width'],
    ['max-w', ['--max-width', '--spacing', '--container'], 'max-width'],
    ['h', ['--height', '--spacing'], 'height'],
    ['min-h', ['--min-height', '--height', '--spacing'], 'min-height'],
    ['max-h', ['--max-height', '--height', '--spacing'], 'max-height'],
  ] as [string, ThemeKey[], string][]) {
    spacingUtility(name, namespaces, (value) => [decl(property, value)], {
      supportsFractions: true,
    })
  }

  utilities.static('container', () => {
    let breakpoints = [...theme.namespace('--breakpoint').values()]
    breakpoints.sort((a, z) => compareBreakpoints(a, z, 'asc'))

    let decls: AstNode[] = [decl('--tw-sort', '--tw-container-component'), decl('width', '100%')]
    for (let breakpoint of breakpoints) {
      decls.push(atRule('@media', `(width >= ${breakpoint})`, [decl('max-width', breakpoint)]))
    }

    return decls
  })

  /**
   * @css `flex`
   */
  staticUtility('flex-auto', [['flex', 'auto']])
  staticUtility('flex-initial', [['flex', '0 auto']])
  staticUtility('flex-none', [['flex', 'none']])

  // The `flex` utility generates `display: flex` but utilities like `flex-1`
  // generate `flex: 1`. Our `functionalUtility` helper can't handle two properties
  // using the same namespace, so we handle this one manually.
  utilities.functional('flex', (candidate) => {
    if (!candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      if (candidate.modifier) return
      return [decl('flex', candidate.value.value)]
    }

    if (candidate.value.fraction) {
      let [lhs, rhs] = segment(candidate.value.fraction, '/')
      if (!isPositiveInteger(lhs) || !isPositiveInteger(rhs)) return
      return [decl('flex', `calc(${candidate.value.fraction} * 100%)`)]
    }

    if (isPositiveInteger(candidate.value.value)) {
      if (candidate.modifier) return
      return [decl('flex', candidate.value.value)]
    }
  })

  suggest('flex', () => [{ supportsFractions: true }])

  /**
   * @css `flex-shrink`
   */
  functionalUtility('shrink', {
    defaultValue: '1',
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    handle: (value) => [decl('flex-shrink', value)],
  })

  /**
   * @css `flex-grow`
   */
  functionalUtility('grow', {
    defaultValue: '1',
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    handle: (value) => [decl('flex-grow', value)],
  })

  suggest('shrink', () => [
    {
      values: ['0'],
      valueThemeKeys: [],
      hasDefaultValue: true,
    },
  ])

  suggest('grow', () => [
    {
      values: ['0'],
      valueThemeKeys: [],
      hasDefaultValue: true,
    },
  ])

  /**
   * @css `flex-basis`
   */
  staticUtility('basis-auto', [['flex-basis', 'auto']])
  staticUtility('basis-full', [['flex-basis', '100%']])
  spacingUtility(
    'basis',
    ['--flex-basis', '--spacing', '--container'],
    (value) => [decl('flex-basis', value)],
    {
      supportsFractions: true,
    },
  )

  /**
   * @css `table-layout`
   */
  staticUtility('table-auto', [['table-layout', 'auto']])
  staticUtility('table-fixed', [['table-layout', 'fixed']])

  /**
   * @css `caption-side`
   */
  staticUtility('caption-top', [['caption-side', 'top']])
  staticUtility('caption-bottom', [['caption-side', 'bottom']])

  /**
   * @css `border-collapse`
   */
  staticUtility('border-collapse', [['border-collapse', 'collapse']])
  staticUtility('border-separate', [['border-collapse', 'separate']])

  let borderSpacingProperties = () =>
    atRoot([
      property('--tw-border-spacing-x', '0', '<length>'),
      property('--tw-border-spacing-y', '0', '<length>'),
    ])

  /**
   * @css `border-spacing`
   */
  spacingUtility('border-spacing', ['--border-spacing', '--spacing'], (value) => [
    borderSpacingProperties(),
    decl('--tw-border-spacing-x', value),
    decl('--tw-border-spacing-y', value),
    decl('border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'),
  ])

  spacingUtility('border-spacing-x', ['--border-spacing', '--spacing'], (value) => [
    borderSpacingProperties(),
    decl('--tw-border-spacing-x', value),
    decl('border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'),
  ])

  spacingUtility('border-spacing-y', ['--border-spacing', '--spacing'], (value) => [
    borderSpacingProperties(),
    decl('--tw-border-spacing-y', value),
    decl('border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'),
  ])

  /**
   * @css `transform-origin`
   */
  staticUtility('origin-center', [['transform-origin', 'center']])
  staticUtility('origin-top', [['transform-origin', 'top']])
  staticUtility('origin-top-right', [['transform-origin', 'top right']])
  staticUtility('origin-right', [['transform-origin', 'right']])
  staticUtility('origin-bottom-right', [['transform-origin', 'bottom right']])
  staticUtility('origin-bottom', [['transform-origin', 'bottom']])
  staticUtility('origin-bottom-left', [['transform-origin', 'bottom left']])
  staticUtility('origin-left', [['transform-origin', 'left']])
  staticUtility('origin-top-left', [['transform-origin', 'top left']])
  functionalUtility('origin', {
    themeKeys: ['--transform-origin'],
    handle: (value) => [decl('transform-origin', value)],
  })

  staticUtility('perspective-origin-center', [['perspective-origin', 'center']])
  staticUtility('perspective-origin-top', [['perspective-origin', 'top']])
  staticUtility('perspective-origin-top-right', [['perspective-origin', 'top right']])
  staticUtility('perspective-origin-right', [['perspective-origin', 'right']])
  staticUtility('perspective-origin-bottom-right', [['perspective-origin', 'bottom right']])
  staticUtility('perspective-origin-bottom', [['perspective-origin', 'bottom']])
  staticUtility('perspective-origin-bottom-left', [['perspective-origin', 'bottom left']])
  staticUtility('perspective-origin-left', [['perspective-origin', 'left']])
  staticUtility('perspective-origin-top-left', [['perspective-origin', 'top left']])
  functionalUtility('perspective-origin', {
    themeKeys: ['--perspective-origin'],
    handle: (value) => [decl('perspective-origin', value)],
  })

  /**
   * @css `perspective`
   */
  staticUtility('perspective-none', [['perspective', 'none']])
  functionalUtility('perspective', {
    themeKeys: ['--perspective'],
    handle: (value) => [decl('perspective', value)],
  })

  let translateProperties = () =>
    atRoot([
      property('--tw-translate-x', '0'),
      property('--tw-translate-y', '0'),
      property('--tw-translate-z', '0'),
    ])

  /**
   * @css `translate`
   */
  staticUtility('translate-none', [['translate', 'none']])
  staticUtility('-translate-full', [
    translateProperties,
    ['--tw-translate-x', '-100%'],
    ['--tw-translate-y', '-100%'],
    ['translate', 'var(--tw-translate-x) var(--tw-translate-y)'],
  ])
  staticUtility('translate-full', [
    translateProperties,
    ['--tw-translate-x', '100%'],
    ['--tw-translate-y', '100%'],
    ['translate', 'var(--tw-translate-x) var(--tw-translate-y)'],
  ])

  spacingUtility(
    'translate',
    ['--translate', '--spacing'],
    (value) => [
      translateProperties(),
      decl('--tw-translate-x', value),
      decl('--tw-translate-y', value),
      decl('translate', 'var(--tw-translate-x) var(--tw-translate-y)'),
    ],
    { supportsNegative: true, supportsFractions: true },
  )

  for (let axis of ['x', 'y']) {
    staticUtility(`-translate-${axis}-full`, [
      translateProperties,
      [`--tw-translate-${axis}`, '-100%'],
      ['translate', `var(--tw-translate-x) var(--tw-translate-y)`],
    ])
    staticUtility(`translate-${axis}-full`, [
      translateProperties,
      [`--tw-translate-${axis}`, '100%'],
      ['translate', `var(--tw-translate-x) var(--tw-translate-y)`],
    ])
    spacingUtility(
      `translate-${axis}`,
      ['--translate', '--spacing'],
      (value) => [
        translateProperties(),
        decl(`--tw-translate-${axis}`, value),
        decl('translate', `var(--tw-translate-x) var(--tw-translate-y)`),
      ],
      {
        supportsNegative: true,
        supportsFractions: true,
      },
    )
  }

  spacingUtility(
    `translate-z`,
    ['--translate', '--spacing'],
    (value) => [
      translateProperties(),
      decl(`--tw-translate-z`, value),
      decl('translate', 'var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)'),
    ],
    {
      supportsNegative: true,
    },
  )

  staticUtility('translate-3d', [
    translateProperties,
    ['translate', 'var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)'],
  ])

  let scaleProperties = () =>
    atRoot([
      property('--tw-scale-x', '1'),
      property('--tw-scale-y', '1'),
      property('--tw-scale-z', '1'),
    ])

  /**
   * @css `scale`
   */
  staticUtility('scale-none', [['scale', 'none']])
  function handleScale({ negative }: { negative: boolean }) {
    return (candidate: Extract<Candidate, { kind: 'functional' }>) => {
      if (!candidate.value || candidate.modifier) return

      let value
      if (candidate.value.kind === 'arbitrary') {
        value = candidate.value.value
        return [decl('scale', value)]
      } else {
        value = theme.resolve(candidate.value.value, ['--scale'])
        if (!value && isPositiveInteger(candidate.value.value)) {
          value = `${candidate.value.value}%`
        }
        if (!value) return
      }
      value = negative ? `calc(${value} * -1)` : value
      return [
        scaleProperties(),
        decl('--tw-scale-x', value),
        decl('--tw-scale-y', value),
        decl('--tw-scale-z', value),
        decl('scale', `var(--tw-scale-x) var(--tw-scale-y)`),
      ]
    }
  }
  utilities.functional('-scale', handleScale({ negative: true }))
  utilities.functional('scale', handleScale({ negative: false }))

  suggest('scale', () => [
    {
      supportsNegative: true,
      values: ['0', '50', '75', '90', '95', '100', '105', '110', '125', '150', '200'],
      valueThemeKeys: ['--scale'],
    },
  ])

  for (let axis of ['x', 'y', 'z']) {
    /**
     * @css `scale`
     */
    functionalUtility(`scale-${axis}`, {
      supportsNegative: true,
      themeKeys: ['--scale'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        scaleProperties(),
        decl(`--tw-scale-${axis}`, value),
        decl(
          'scale',
          `var(--tw-scale-x) var(--tw-scale-y)${axis === 'z' ? ' var(--tw-scale-z)' : ''}`,
        ),
      ],
    })

    suggest(`scale-${axis}`, () => [
      {
        supportsNegative: true,
        values: ['0', '50', '75', '90', '95', '100', '105', '110', '125', '150', '200'],
        valueThemeKeys: ['--scale'],
      },
    ])
  }

  /**
   * @css `scale`
   */
  staticUtility('scale-3d', [
    scaleProperties,
    ['scale', 'var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)'],
  ])

  /**
   * @css `rotate`
   *
   * `rotate-45` => `rotate: 45deg`
   * `rotate-[x_45deg]` => `rotate: x 45deg`
   * `rotate-[1_2_3_45deg]` => `rotate: 1 2 3 45deg`
   */
  staticUtility('rotate-none', [['rotate', 'none']])

  function handleRotate({ negative }: { negative: boolean }) {
    return (candidate: Extract<Candidate, { kind: 'functional' }>) => {
      if (!candidate.value || candidate.modifier) return

      let value
      if (candidate.value.kind === 'arbitrary') {
        value = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['angle', 'vector'])
        if (type === 'vector') {
          return [decl('rotate', `${value} var(--tw-rotate)`)]
        } else if (type !== 'angle') {
          return [decl('rotate', value)]
        }
      } else {
        value = theme.resolve(candidate.value.value, ['--rotate'])
        if (!value && isPositiveInteger(candidate.value.value)) {
          value = `${candidate.value.value}deg`
        }
        if (!value) return
      }
      return [decl('rotate', negative ? `calc(${value} * -1)` : value)]
    }
  }

  utilities.functional('-rotate', handleRotate({ negative: true }))
  utilities.functional('rotate', handleRotate({ negative: false }))

  suggest('rotate', () => [
    {
      supportsNegative: true,
      values: ['0', '1', '2', '3', '6', '12', '45', '90', '180'],
      valueThemeKeys: ['--rotate'],
    },
  ])

  {
    let transformValue = [
      'var(--tw-rotate-x,)',
      'var(--tw-rotate-y,)',
      'var(--tw-rotate-z,)',
      'var(--tw-skew-x,)',
      'var(--tw-skew-y,)',
    ].join(' ')

    let transformProperties = () =>
      atRoot([
        property('--tw-rotate-x'),
        property('--tw-rotate-y'),
        property('--tw-rotate-z'),
        property('--tw-skew-x'),
        property('--tw-skew-y'),
      ])

    for (let axis of ['x', 'y', 'z']) {
      functionalUtility(`rotate-${axis}`, {
        supportsNegative: true,
        themeKeys: ['--rotate'],
        handleBareValue: ({ value }) => {
          if (!isPositiveInteger(value)) return null
          return `${value}deg`
        },
        handle: (value) => [
          transformProperties(),
          decl(`--tw-rotate-${axis}`, `rotate${axis.toUpperCase()}(${value})`),
          decl('transform', transformValue),
        ],
      })

      suggest(`rotate-${axis}`, () => [
        {
          supportsNegative: true,
          values: ['0', '1', '2', '3', '6', '12', '45', '90', '180'],
          valueThemeKeys: ['--rotate'],
        },
      ])
    }

    /**
     * @css `transform`
     * @css `skew()`
     */
    functionalUtility('skew', {
      supportsNegative: true,
      themeKeys: ['--skew'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}deg`
      },
      handle: (value) => [
        transformProperties(),
        decl('--tw-skew-x', `skewX(${value})`),
        decl('--tw-skew-y', `skewY(${value})`),
        decl('transform', transformValue),
      ],
    })

    /**
     * @css `transform`
     * @css `skew()`
     */
    functionalUtility('skew-x', {
      supportsNegative: true,
      themeKeys: ['--skew'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}deg`
      },
      handle: (value) => [
        transformProperties(),
        decl('--tw-skew-x', `skewX(${value})`),
        decl('transform', transformValue),
      ],
    })

    /**
     * @css `transform`
     * @css `skew()`
     */
    functionalUtility('skew-y', {
      supportsNegative: true,
      themeKeys: ['--skew'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}deg`
      },
      handle: (value) => [
        transformProperties(),
        decl('--tw-skew-y', `skewY(${value})`),
        decl('transform', transformValue),
      ],
    })

    suggest('skew', () => [
      {
        supportsNegative: true,
        values: ['0', '1', '2', '3', '6', '12'],
        valueThemeKeys: ['--skew'],
      },
    ])

    suggest('skew-x', () => [
      {
        supportsNegative: true,
        values: ['0', '1', '2', '3', '6', '12'],
        valueThemeKeys: ['--skew'],
      },
    ])

    suggest('skew-y', () => [
      {
        supportsNegative: true,
        values: ['0', '1', '2', '3', '6', '12'],
        valueThemeKeys: ['--skew'],
      },
    ])

    /**
     * @css `transform`
     */
    utilities.functional('transform', (candidate) => {
      if (candidate.modifier) return

      let value: string | null = null
      if (!candidate.value) {
        value = transformValue
      } else if (candidate.value.kind === 'arbitrary') {
        value = candidate.value.value
      }

      if (value === null) return

      return [transformProperties(), decl('transform', value)]
    })
    suggest('transform', () => [
      {
        hasDefaultValue: true,
      },
    ])

    staticUtility('transform-cpu', [['transform', transformValue]])
    staticUtility('transform-gpu', [['transform', `translateZ(0) ${transformValue}`]])
    staticUtility('transform-none', [['transform', 'none']])
  }

  /**
   * @css `transform-style`
   */
  staticUtility('transform-flat', [['transform-style', 'flat']])
  staticUtility('transform-3d', [['transform-style', 'preserve-3d']])

  /**
   * @css `transform-box`
   */
  staticUtility('transform-content', [['transform-box', 'content-box']])
  staticUtility('transform-border', [['transform-box', 'border-box']])
  staticUtility('transform-fill', [['transform-box', 'fill-box']])
  staticUtility('transform-stroke', [['transform-box', 'stroke-box']])
  staticUtility('transform-view', [['transform-box', 'view-box']])

  /**
   * @css `backface-visibility`
   */
  staticUtility('backface-visible', [['backface-visibility', 'visible']])
  staticUtility('backface-hidden', [['backface-visibility', 'hidden']])

  /**
   * @css `cursor`
   */
  for (let value of [
    'auto',
    'default',
    'pointer',
    'wait',
    'text',
    'move',
    'help',
    'not-allowed',
    'none',
    'context-menu',
    'progress',
    'cell',
    'crosshair',
    'vertical-text',
    'alias',
    'copy',
    'no-drop',
    'grab',
    'grabbing',
    'all-scroll',
    'col-resize',
    'row-resize',
    'n-resize',
    'e-resize',
    's-resize',
    'w-resize',
    'ne-resize',
    'nw-resize',
    'se-resize',
    'sw-resize',
    'ew-resize',
    'ns-resize',
    'nesw-resize',
    'nwse-resize',
    'zoom-in',
    'zoom-out',
  ]) {
    staticUtility(`cursor-${value}`, [['cursor', value]])
  }

  functionalUtility('cursor', {
    themeKeys: ['--cursor'],
    handle: (value) => [decl('cursor', value)],
  })

  /**
   * @css `touch-action`
   */
  for (let value of ['auto', 'none', 'manipulation']) {
    staticUtility(`touch-${value}`, [['touch-action', value]])
  }

  let touchProperties = () =>
    atRoot([property('--tw-pan-x'), property('--tw-pan-y'), property('--tw-pinch-zoom')])

  for (let value of ['x', 'left', 'right']) {
    staticUtility(`touch-pan-${value}`, [
      touchProperties,
      ['--tw-pan-x', `pan-${value}`],
      ['touch-action', 'var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)'],
    ])
  }

  for (let value of ['y', 'up', 'down']) {
    staticUtility(`touch-pan-${value}`, [
      touchProperties,
      ['--tw-pan-y', `pan-${value}`],
      ['touch-action', 'var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)'],
    ])
  }

  staticUtility('touch-pinch-zoom', [
    touchProperties,
    ['--tw-pinch-zoom', `pinch-zoom`],
    ['touch-action', 'var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)'],
  ])

  /**
   * @css `user-select`
   */
  for (let value of ['none', 'text', 'all', 'auto']) {
    staticUtility(`select-${value}`, [
      ['-webkit-user-select', value],
      ['user-select', value],
    ])
  }

  /**
   * @css `resize`
   */
  staticUtility('resize-none', [['resize', 'none']])
  staticUtility('resize-x', [['resize', 'horizontal']])
  staticUtility('resize-y', [['resize', 'vertical']])
  staticUtility('resize', [['resize', 'both']])

  /**
   * @css `scroll-snap-type`
   */
  staticUtility('snap-none', [['scroll-snap-type', 'none']])

  let snapProperties = () => atRoot([property('--tw-scroll-snap-strictness', 'proximity', '*')])

  for (let value of ['x', 'y', 'both']) {
    staticUtility(`snap-${value}`, [
      snapProperties,
      ['scroll-snap-type', `${value} var(--tw-scroll-snap-strictness)`],
    ])
  }

  staticUtility('snap-mandatory', [snapProperties, ['--tw-scroll-snap-strictness', 'mandatory']])

  staticUtility('snap-proximity', [snapProperties, ['--tw-scroll-snap-strictness', 'proximity']])

  staticUtility('snap-align-none', [['scroll-snap-align', 'none']])
  staticUtility('snap-start', [['scroll-snap-align', 'start']])
  staticUtility('snap-end', [['scroll-snap-align', 'end']])
  staticUtility('snap-center', [['scroll-snap-align', 'center']])

  staticUtility('snap-normal', [['scroll-snap-stop', 'normal']])
  staticUtility('snap-always', [['scroll-snap-stop', 'always']])

  /**
   * @css `scroll-margin`
   */
  for (let [namespace, property] of [
    ['scroll-m', 'scroll-margin'],
    ['scroll-mx', 'scroll-margin-inline'],
    ['scroll-my', 'scroll-margin-block'],
    ['scroll-ms', 'scroll-margin-inline-start'],
    ['scroll-me', 'scroll-margin-inline-end'],
    ['scroll-mt', 'scroll-margin-top'],
    ['scroll-mr', 'scroll-margin-right'],
    ['scroll-mb', 'scroll-margin-bottom'],
    ['scroll-ml', 'scroll-margin-left'],
  ] as const) {
    spacingUtility(
      namespace,
      ['--scroll-margin', '--spacing'],
      (value) => [decl(property, value)],
      {
        supportsNegative: true,
      },
    )
  }

  /**
   * @css `scroll-padding`
   */
  for (let [namespace, property] of [
    ['scroll-p', 'scroll-padding'],
    ['scroll-px', 'scroll-padding-inline'],
    ['scroll-py', 'scroll-padding-block'],
    ['scroll-ps', 'scroll-padding-inline-start'],
    ['scroll-pe', 'scroll-padding-inline-end'],
    ['scroll-pt', 'scroll-padding-top'],
    ['scroll-pr', 'scroll-padding-right'],
    ['scroll-pb', 'scroll-padding-bottom'],
    ['scroll-pl', 'scroll-padding-left'],
  ] as const) {
    spacingUtility(namespace, ['--scroll-padding', '--spacing'], (value) => [decl(property, value)])
  }

  staticUtility('list-inside', [['list-style-position', 'inside']])
  staticUtility('list-outside', [['list-style-position', 'outside']])

  /**
   * @css `list-style-type`
   */
  staticUtility('list-none', [['list-style-type', 'none']])
  staticUtility('list-disc', [['list-style-type', 'disc']])
  staticUtility('list-decimal', [['list-style-type', 'decimal']])
  functionalUtility('list', {
    themeKeys: ['--list-style-type'],
    handle: (value) => [decl('list-style-type', value)],
  })

  // list-image-*

  staticUtility('list-image-none', [['list-style-image', 'none']])
  functionalUtility('list-image', {
    themeKeys: ['--list-style-image'],
    handle: (value) => [decl('list-style-image', value)],
  })

  staticUtility('appearance-none', [['appearance', 'none']])
  staticUtility('appearance-auto', [['appearance', 'auto']])

  staticUtility('scheme-normal', [['color-scheme', 'normal']])
  staticUtility('scheme-dark', [['color-scheme', 'dark']])
  staticUtility('scheme-light', [['color-scheme', 'light']])
  staticUtility('scheme-light-dark', [['color-scheme', 'light dark']])
  staticUtility('scheme-only-dark', [['color-scheme', 'only dark']])
  staticUtility('scheme-only-light', [['color-scheme', 'only light']])

  // columns-*
  staticUtility('columns-auto', [['columns', 'auto']])

  functionalUtility('columns', {
    themeKeys: ['--columns', '--container'],
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return value
    },
    handle: (value) => [decl('columns', value)],
  })

  suggest('columns', () => [
    {
      values: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--columns', '--container'],
    },
  ])

  for (let value of ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column']) {
    staticUtility(`break-before-${value}`, [['break-before', value]])
  }

  for (let value of ['auto', 'avoid', 'avoid-page', 'avoid-column']) {
    staticUtility(`break-inside-${value}`, [['break-inside', value]])
  }

  for (let value of ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column']) {
    staticUtility(`break-after-${value}`, [['break-after', value]])
  }

  staticUtility('grid-flow-row', [['grid-auto-flow', 'row']])
  staticUtility('grid-flow-col', [['grid-auto-flow', 'column']])
  staticUtility('grid-flow-dense', [['grid-auto-flow', 'dense']])
  staticUtility('grid-flow-row-dense', [['grid-auto-flow', 'row dense']])
  staticUtility('grid-flow-col-dense', [['grid-auto-flow', 'column dense']])

  staticUtility('auto-cols-auto', [['grid-auto-columns', 'auto']])
  staticUtility('auto-cols-min', [['grid-auto-columns', 'min-content']])
  staticUtility('auto-cols-max', [['grid-auto-columns', 'max-content']])
  staticUtility('auto-cols-fr', [['grid-auto-columns', 'minmax(0, 1fr)']])
  functionalUtility('auto-cols', {
    themeKeys: ['--grid-auto-columns'],
    handle: (value) => [decl('grid-auto-columns', value)],
  })

  staticUtility('auto-rows-auto', [['grid-auto-rows', 'auto']])
  staticUtility('auto-rows-min', [['grid-auto-rows', 'min-content']])
  staticUtility('auto-rows-max', [['grid-auto-rows', 'max-content']])
  staticUtility('auto-rows-fr', [['grid-auto-rows', 'minmax(0, 1fr)']])
  functionalUtility('auto-rows', {
    themeKeys: ['--grid-auto-rows'],
    handle: (value) => [decl('grid-auto-rows', value)],
  })

  staticUtility('grid-cols-none', [['grid-template-columns', 'none']])
  staticUtility('grid-cols-subgrid', [['grid-template-columns', 'subgrid']])
  functionalUtility('grid-cols', {
    themeKeys: ['--grid-template-columns'],
    handleBareValue: ({ value }) => {
      if (!isStrictPositiveInteger(value)) return null
      return `repeat(${value}, minmax(0, 1fr))`
    },
    handle: (value) => [decl('grid-template-columns', value)],
  })

  staticUtility('grid-rows-none', [['grid-template-rows', 'none']])
  staticUtility('grid-rows-subgrid', [['grid-template-rows', 'subgrid']])
  functionalUtility('grid-rows', {
    themeKeys: ['--grid-template-rows'],
    handleBareValue: ({ value }) => {
      if (!isStrictPositiveInteger(value)) return null
      return `repeat(${value}, minmax(0, 1fr))`
    },
    handle: (value) => [decl('grid-template-rows', value)],
  })

  suggest('grid-cols', () => [
    {
      values: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--grid-template-columns'],
    },
  ])

  suggest('grid-rows', () => [
    {
      values: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--grid-template-rows'],
    },
  ])

  staticUtility('flex-row', [['flex-direction', 'row']])
  staticUtility('flex-row-reverse', [['flex-direction', 'row-reverse']])
  staticUtility('flex-col', [['flex-direction', 'column']])
  staticUtility('flex-col-reverse', [['flex-direction', 'column-reverse']])

  staticUtility('flex-wrap', [['flex-wrap', 'wrap']])
  staticUtility('flex-nowrap', [['flex-wrap', 'nowrap']])
  staticUtility('flex-wrap-reverse', [['flex-wrap', 'wrap-reverse']])

  staticUtility('place-content-center', [['place-content', 'center']])
  staticUtility('place-content-start', [['place-content', 'start']])
  staticUtility('place-content-end', [['place-content', 'end']])
  staticUtility('place-content-center-safe', [['place-content', 'safe center']])
  staticUtility('place-content-end-safe', [['place-content', 'safe end']])
  staticUtility('place-content-between', [['place-content', 'space-between']])
  staticUtility('place-content-around', [['place-content', 'space-around']])
  staticUtility('place-content-evenly', [['place-content', 'space-evenly']])
  staticUtility('place-content-baseline', [['place-content', 'baseline']])
  staticUtility('place-content-stretch', [['place-content', 'stretch']])

  staticUtility('place-items-center', [['place-items', 'center']])
  staticUtility('place-items-start', [['place-items', 'start']])
  staticUtility('place-items-end', [['place-items', 'end']])
  staticUtility('place-items-center-safe', [['place-items', 'safe center']])
  staticUtility('place-items-end-safe', [['place-items', 'safe end']])
  staticUtility('place-items-baseline', [['place-items', 'baseline']])
  staticUtility('place-items-stretch', [['place-items', 'stretch']])

  staticUtility('content-normal', [['align-content', 'normal']])
  staticUtility('content-center', [['align-content', 'center']])
  staticUtility('content-start', [['align-content', 'flex-start']])
  staticUtility('content-end', [['align-content', 'flex-end']])
  staticUtility('content-center-safe', [['align-content', 'safe center']])
  staticUtility('content-end-safe', [['align-content', 'safe flex-end']])
  staticUtility('content-between', [['align-content', 'space-between']])
  staticUtility('content-around', [['align-content', 'space-around']])
  staticUtility('content-evenly', [['align-content', 'space-evenly']])
  staticUtility('content-baseline', [['align-content', 'baseline']])
  staticUtility('content-stretch', [['align-content', 'stretch']])

  staticUtility('items-center', [['align-items', 'center']])
  staticUtility('items-start', [['align-items', 'flex-start']])
  staticUtility('items-end', [['align-items', 'flex-end']])
  staticUtility('items-center-safe', [['align-items', 'safe center']])
  staticUtility('items-end-safe', [['align-items', 'safe flex-end']])
  staticUtility('items-baseline', [['align-items', 'baseline']])
  staticUtility('items-baseline-last', [['align-items', 'last baseline']])
  staticUtility('items-stretch', [['align-items', 'stretch']])

  staticUtility('justify-normal', [['justify-content', 'normal']])
  staticUtility('justify-center', [['justify-content', 'center']])
  staticUtility('justify-start', [['justify-content', 'flex-start']])
  staticUtility('justify-end', [['justify-content', 'flex-end']])
  staticUtility('justify-center-safe', [['justify-content', 'safe center']])
  staticUtility('justify-end-safe', [['justify-content', 'safe flex-end']])
  staticUtility('justify-between', [['justify-content', 'space-between']])
  staticUtility('justify-around', [['justify-content', 'space-around']])
  staticUtility('justify-evenly', [['justify-content', 'space-evenly']])
  staticUtility('justify-baseline', [['justify-content', 'baseline']])
  staticUtility('justify-stretch', [['justify-content', 'stretch']])

  staticUtility('justify-items-normal', [['justify-items', 'normal']])
  staticUtility('justify-items-center', [['justify-items', 'center']])
  staticUtility('justify-items-start', [['justify-items', 'start']])
  staticUtility('justify-items-end', [['justify-items', 'end']])
  staticUtility('justify-items-center-safe', [['justify-items', 'safe center']])
  staticUtility('justify-items-end-safe', [['justify-items', 'safe end']])
  staticUtility('justify-items-stretch', [['justify-items', 'stretch']])

  spacingUtility('gap', ['--gap', '--spacing'], (value) => [decl('gap', value)])
  spacingUtility('gap-x', ['--gap', '--spacing'], (value) => [decl('column-gap', value)])
  spacingUtility('gap-y', ['--gap', '--spacing'], (value) => [decl('row-gap', value)])

  spacingUtility(
    'space-x',
    ['--space', '--spacing'],
    (value) => [
      atRoot([property('--tw-space-x-reverse', '0')]),

      styleRule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'row-gap'),
        decl('--tw-space-x-reverse', '0'),
        decl('margin-inline-start', `calc(${value} * var(--tw-space-x-reverse))`),
        decl('margin-inline-end', `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`),
      ]),
    ],
    { supportsNegative: true },
  )

  spacingUtility(
    'space-y',
    ['--space', '--spacing'],
    (value) => [
      atRoot([property('--tw-space-y-reverse', '0')]),
      styleRule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'column-gap'),
        decl('--tw-space-y-reverse', '0'),
        decl('margin-block-start', `calc(${value} * var(--tw-space-y-reverse))`),
        decl('margin-block-end', `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`),
      ]),
    ],
    { supportsNegative: true },
  )

  staticUtility('space-x-reverse', [
    () => atRoot([property('--tw-space-x-reverse', '0')]),
    () =>
      styleRule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'row-gap'),
        decl('--tw-space-x-reverse', '1'),
      ]),
  ])

  staticUtility('space-y-reverse', [
    () => atRoot([property('--tw-space-y-reverse', '0')]),
    () =>
      styleRule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'column-gap'),
        decl('--tw-space-y-reverse', '1'),
      ]),
  ])

  staticUtility('accent-auto', [['accent-color', 'auto']])
  colorUtility('accent', {
    themeKeys: ['--accent-color', '--color'],
    handle: (value) => [decl('accent-color', value)],
  })

  colorUtility('caret', {
    themeKeys: ['--caret-color', '--color'],
    handle: (value) => [decl('caret-color', value)],
  })

  colorUtility('divide', {
    themeKeys: ['--divide-color', '--color'],
    handle: (value) => [
      styleRule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'divide-color'),
        decl('border-color', value),
      ]),
    ],
  })

  staticUtility('place-self-auto', [['place-self', 'auto']])
  staticUtility('place-self-start', [['place-self', 'start']])
  staticUtility('place-self-end', [['place-self', 'end']])
  staticUtility('place-self-center', [['place-self', 'center']])
  staticUtility('place-self-end-safe', [['place-self', 'safe end']])
  staticUtility('place-self-center-safe', [['place-self', 'safe center']])
  staticUtility('place-self-stretch', [['place-self', 'stretch']])

  staticUtility('self-auto', [['align-self', 'auto']])
  staticUtility('self-start', [['align-self', 'flex-start']])
  staticUtility('self-end', [['align-self', 'flex-end']])
  staticUtility('self-center', [['align-self', 'center']])
  staticUtility('self-end-safe', [['align-self', 'safe flex-end']])
  staticUtility('self-center-safe', [['align-self', 'safe center']])
  staticUtility('self-stretch', [['align-self', 'stretch']])
  staticUtility('self-baseline', [['align-self', 'baseline']])
  staticUtility('self-baseline-last', [['align-self', 'last baseline']])

  staticUtility('justify-self-auto', [['justify-self', 'auto']])
  staticUtility('justify-self-start', [['justify-self', 'flex-start']])
  staticUtility('justify-self-end', [['justify-self', 'flex-end']])
  staticUtility('justify-self-center', [['justify-self', 'center']])
  staticUtility('justify-self-end-safe', [['justify-self', 'safe flex-end']])
  staticUtility('justify-self-center-safe', [['justify-self', 'safe center']])
  staticUtility('justify-self-stretch', [['justify-self', 'stretch']])

  for (let value of ['auto', 'hidden', 'clip', 'visible', 'scroll']) {
    staticUtility(`overflow-${value}`, [['overflow', value]])
    staticUtility(`overflow-x-${value}`, [['overflow-x', value]])
    staticUtility(`overflow-y-${value}`, [['overflow-y', value]])
  }

  for (let value of ['auto', 'contain', 'none']) {
    staticUtility(`overscroll-${value}`, [['overscroll-behavior', value]])
    staticUtility(`overscroll-x-${value}`, [['overscroll-behavior-x', value]])
    staticUtility(`overscroll-y-${value}`, [['overscroll-behavior-y', value]])
  }

  staticUtility('scroll-auto', [['scroll-behavior', 'auto']])
  staticUtility('scroll-smooth', [['scroll-behavior', 'smooth']])

  staticUtility('truncate', [
    ['overflow', 'hidden'],
    ['text-overflow', 'ellipsis'],
    ['white-space', 'nowrap'],
  ])

  staticUtility('text-ellipsis', [['text-overflow', 'ellipsis']])
  staticUtility('text-clip', [['text-overflow', 'clip']])

  staticUtility('hyphens-none', [
    ['-webkit-hyphens', 'none'],
    ['hyphens', 'none'],
  ])
  staticUtility('hyphens-manual', [
    ['-webkit-hyphens', 'manual'],
    ['hyphens', 'manual'],
  ])
  staticUtility('hyphens-auto', [
    ['-webkit-hyphens', 'auto'],
    ['hyphens', 'auto'],
  ])

  staticUtility('whitespace-normal', [['white-space', 'normal']])
  staticUtility('whitespace-nowrap', [['white-space', 'nowrap']])
  staticUtility('whitespace-pre', [['white-space', 'pre']])
  staticUtility('whitespace-pre-line', [['white-space', 'pre-line']])
  staticUtility('whitespace-pre-wrap', [['white-space', 'pre-wrap']])
  staticUtility('whitespace-break-spaces', [['white-space', 'break-spaces']])

  staticUtility('text-wrap', [['text-wrap', 'wrap']])
  staticUtility('text-nowrap', [['text-wrap', 'nowrap']])
  staticUtility('text-balance', [['text-wrap', 'balance']])
  staticUtility('text-pretty', [['text-wrap', 'pretty']])
  staticUtility('break-normal', [
    ['overflow-wrap', 'normal'],
    ['word-break', 'normal'],
  ])
  staticUtility('break-words', [['overflow-wrap', 'break-word']])
  staticUtility('break-all', [['word-break', 'break-all']])
  staticUtility('break-keep', [['word-break', 'keep-all']])

  staticUtility('wrap-anywhere', [['overflow-wrap', 'anywhere']])
  staticUtility('wrap-break-word', [['overflow-wrap', 'break-word']])
  staticUtility('wrap-normal', [['overflow-wrap', 'normal']])

  {
    // border-radius
    for (let [root, properties] of [
      ['rounded', ['border-radius']],
      ['rounded-s', ['border-start-start-radius', 'border-end-start-radius']],
      ['rounded-e', ['border-start-end-radius', 'border-end-end-radius']],
      ['rounded-t', ['border-top-left-radius', 'border-top-right-radius']],
      ['rounded-r', ['border-top-right-radius', 'border-bottom-right-radius']],
      ['rounded-b', ['border-bottom-right-radius', 'border-bottom-left-radius']],
      ['rounded-l', ['border-top-left-radius', 'border-bottom-left-radius']],
      ['rounded-ss', ['border-start-start-radius']],
      ['rounded-se', ['border-start-end-radius']],
      ['rounded-ee', ['border-end-end-radius']],
      ['rounded-es', ['border-end-start-radius']],
      ['rounded-tl', ['border-top-left-radius']],
      ['rounded-tr', ['border-top-right-radius']],
      ['rounded-br', ['border-bottom-right-radius']],
      ['rounded-bl', ['border-bottom-left-radius']],
    ] as const) {
      staticUtility(
        `${root}-none`,
        properties.map((property) => [property, '0']),
      )
      staticUtility(
        `${root}-full`,
        properties.map((property) => [property, 'calc(infinity * 1px)']),
      )
      functionalUtility(root, {
        themeKeys: ['--radius'],
        handle: (value) => properties.map((property) => decl(property, value)),
      })
    }
  }

  staticUtility('border-solid', [
    ['--tw-border-style', 'solid'],
    ['border-style', 'solid'],
  ])
  staticUtility('border-dashed', [
    ['--tw-border-style', 'dashed'],
    ['border-style', 'dashed'],
  ])
  staticUtility('border-dotted', [
    ['--tw-border-style', 'dotted'],
    ['border-style', 'dotted'],
  ])
  staticUtility('border-double', [
    ['--tw-border-style', 'double'],
    ['border-style', 'double'],
  ])
  staticUtility('border-hidden', [
    ['--tw-border-style', 'hidden'],
    ['border-style', 'hidden'],
  ])
  staticUtility('border-none', [
    ['--tw-border-style', 'none'],
    ['border-style', 'none'],
  ])

  {
    // border-* (color)
    type BorderDescription = {
      width: (value: string) => AstNode[] | undefined
      color: (value: string) => AstNode[] | undefined
    }

    let borderProperties = () => {
      return atRoot([property('--tw-border-style', 'solid')])
    }

    function borderSideUtility(classRoot: string, desc: BorderDescription) {
      utilities.functional(classRoot, (candidate) => {
        if (!candidate.value) {
          if (candidate.modifier) return
          let value = theme.get(['--default-border-width']) ?? '1px'
          let decls = desc.width(value)
          if (!decls) return
          return [borderProperties(), ...decls]
        }

        if (candidate.value.kind === 'arbitrary') {
          let value: string | null = candidate.value.value
          let type =
            candidate.value.dataType ?? inferDataType(value, ['color', 'line-width', 'length'])

          switch (type) {
            case 'line-width':
            case 'length': {
              if (candidate.modifier) return
              let decls = desc.width(value)
              if (!decls) return
              return [borderProperties(), ...decls]
            }
            default: {
              value = asColor(value, candidate.modifier, theme)
              if (value === null) return

              return desc.color(value)
            }
          }
        }

        // `border-color` property
        {
          let value = resolveThemeColor(candidate, theme, ['--border-color', '--color'])
          if (value) {
            return desc.color(value)
          }
        }

        // `border-width` property
        {
          if (candidate.modifier) return
          let value = theme.resolve(candidate.value.value, ['--border-width'])
          if (value) {
            let decls = desc.width(value)
            if (!decls) return
            return [borderProperties(), ...decls]
          }

          if (isPositiveInteger(candidate.value.value)) {
            let decls = desc.width(`${candidate.value.value}px`)
            if (!decls) return
            return [borderProperties(), ...decls]
          }
        }
      })

      suggest(classRoot, () => [
        {
          values: ['current', 'inherit', 'transparent'],
          valueThemeKeys: ['--border-color', '--color'],
          modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
          hasDefaultValue: true,
        },
        {
          values: ['0', '2', '4', '8'],
          valueThemeKeys: ['--border-width'],
        },
      ])
    }

    borderSideUtility('border', {
      width: (value) => [
        decl('border-style', 'var(--tw-border-style)'),
        decl('border-width', value),
      ],
      color: (value) => [decl('border-color', value)],
    })

    borderSideUtility('border-x', {
      width: (value) => [
        decl('border-inline-style', 'var(--tw-border-style)'),
        decl('border-inline-width', value),
      ],
      color: (value) => [decl('border-inline-color', value)],
    })

    borderSideUtility('border-y', {
      width: (value) => [
        decl('border-block-style', 'var(--tw-border-style)'),
        decl('border-block-width', value),
      ],
      color: (value) => [decl('border-block-color', value)],
    })

    borderSideUtility('border-s', {
      width: (value) => [
        decl('border-inline-start-style', 'var(--tw-border-style)'),
        decl('border-inline-start-width', value),
      ],
      color: (value) => [decl('border-inline-start-color', value)],
    })

    borderSideUtility('border-e', {
      width: (value) => [
        decl('border-inline-end-style', 'var(--tw-border-style)'),
        decl('border-inline-end-width', value),
      ],
      color: (value) => [decl('border-inline-end-color', value)],
    })

    borderSideUtility('border-t', {
      width: (value) => [
        decl('border-top-style', 'var(--tw-border-style)'),
        decl('border-top-width', value),
      ],
      color: (value) => [decl('border-top-color', value)],
    })

    borderSideUtility('border-r', {
      width: (value) => [
        decl('border-right-style', 'var(--tw-border-style)'),
        decl('border-right-width', value),
      ],
      color: (value) => [decl('border-right-color', value)],
    })

    borderSideUtility('border-b', {
      width: (value) => [
        decl('border-bottom-style', 'var(--tw-border-style)'),
        decl('border-bottom-width', value),
      ],
      color: (value) => [decl('border-bottom-color', value)],
    })

    borderSideUtility('border-l', {
      width: (value) => [
        decl('border-left-style', 'var(--tw-border-style)'),
        decl('border-left-width', value),
      ],
      color: (value) => [decl('border-left-color', value)],
    })

    functionalUtility('divide-x', {
      defaultValue: theme.get(['--default-border-width']) ?? '1px',
      themeKeys: ['--divide-width', '--border-width'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}px`
      },
      handle: (value) => [
        atRoot([property('--tw-divide-x-reverse', '0')]),

        styleRule(':where(& > :not(:last-child))', [
          decl('--tw-sort', 'divide-x-width'),
          borderProperties(),
          decl('--tw-divide-x-reverse', '0'),
          decl('border-inline-style', 'var(--tw-border-style)'),
          decl('border-inline-start-width', `calc(${value} * var(--tw-divide-x-reverse))`),
          decl('border-inline-end-width', `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`),
        ]),
      ],
    })

    functionalUtility('divide-y', {
      defaultValue: theme.get(['--default-border-width']) ?? '1px',
      themeKeys: ['--divide-width', '--border-width'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}px`
      },
      handle: (value) => [
        atRoot([property('--tw-divide-y-reverse', '0')]),

        styleRule(':where(& > :not(:last-child))', [
          decl('--tw-sort', 'divide-y-width'),
          borderProperties(),
          decl('--tw-divide-y-reverse', '0'),
          decl('border-bottom-style', 'var(--tw-border-style)'),
          decl('border-top-style', 'var(--tw-border-style)'),
          decl('border-top-width', `calc(${value} * var(--tw-divide-y-reverse))`),
          decl('border-bottom-width', `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`),
        ]),
      ],
    })

    suggest('divide-x', () => [
      {
        values: ['0', '2', '4', '8'],
        valueThemeKeys: ['--divide-width', '--border-width'],
        hasDefaultValue: true,
      },
    ])

    suggest('divide-y', () => [
      {
        values: ['0', '2', '4', '8'],
        valueThemeKeys: ['--divide-width', '--border-width'],
        hasDefaultValue: true,
      },
    ])

    staticUtility('divide-x-reverse', [
      () => atRoot([property('--tw-divide-x-reverse', '0')]),
      () => styleRule(':where(& > :not(:last-child))', [decl('--tw-divide-x-reverse', '1')]),
    ])

    staticUtility('divide-y-reverse', [
      () => atRoot([property('--tw-divide-y-reverse', '0')]),
      () => styleRule(':where(& > :not(:last-child))', [decl('--tw-divide-y-reverse', '1')]),
    ])

    for (let value of ['solid', 'dashed', 'dotted', 'double', 'none']) {
      staticUtility(`divide-${value}`, [
        () =>
          styleRule(':where(& > :not(:last-child))', [
            decl('--tw-sort', 'divide-style'),
            decl('--tw-border-style', value),
            decl('border-style', value),
          ]),
      ])
    }
  }

  staticUtility('bg-auto', [['background-size', 'auto']])
  staticUtility('bg-cover', [['background-size', 'cover']])
  staticUtility('bg-contain', [['background-size', 'contain']])
  functionalUtility('bg-size', {
    handle(value) {
      if (!value) return
      return [decl('background-size', value)]
    },
  })

  staticUtility('bg-fixed', [['background-attachment', 'fixed']])
  staticUtility('bg-local', [['background-attachment', 'local']])
  staticUtility('bg-scroll', [['background-attachment', 'scroll']])

  staticUtility('bg-top', [['background-position', 'top']])
  staticUtility('bg-top-left', [['background-position', 'left top']])
  staticUtility('bg-top-right', [['background-position', 'right top']])
  staticUtility('bg-bottom', [['background-position', 'bottom']])
  staticUtility('bg-bottom-left', [['background-position', 'left bottom']])
  staticUtility('bg-bottom-right', [['background-position', 'right bottom']])
  staticUtility('bg-left', [['background-position', 'left']])
  staticUtility('bg-right', [['background-position', 'right']])
  staticUtility('bg-center', [['background-position', 'center']])
  functionalUtility('bg-position', {
    handle(value) {
      if (!value) return
      return [decl('background-position', value)]
    },
  })

  staticUtility('bg-repeat', [['background-repeat', 'repeat']])
  staticUtility('bg-no-repeat', [['background-repeat', 'no-repeat']])
  staticUtility('bg-repeat-x', [['background-repeat', 'repeat-x']])
  staticUtility('bg-repeat-y', [['background-repeat', 'repeat-y']])
  staticUtility('bg-repeat-round', [['background-repeat', 'round']])
  staticUtility('bg-repeat-space', [['background-repeat', 'space']])

  staticUtility('bg-none', [['background-image', 'none']])

  {
    let suggestedModifiers = [
      'oklab',
      'oklch',
      'srgb',
      'hsl',
      'longer',
      'shorter',
      'increasing',
      'decreasing',
    ]

    let linearGradientDirections = new Map([
      ['to-t', 'to top'],
      ['to-tr', 'to top right'],
      ['to-r', 'to right'],
      ['to-br', 'to bottom right'],
      ['to-b', 'to bottom'],
      ['to-bl', 'to bottom left'],
      ['to-l', 'to left'],
      ['to-tl', 'to top left'],
    ])

    function resolveInterpolationModifier(modifier: CandidateModifier | null) {
      let interpolationMethod = 'in oklab'

      if (modifier?.kind === 'named') {
        switch (modifier.value) {
          case 'longer':
          case 'shorter':
          case 'increasing':
          case 'decreasing':
            interpolationMethod = `in oklch ${modifier.value} hue`
            break
          default:
            interpolationMethod = `in ${modifier.value}`
        }
      } else if (modifier?.kind === 'arbitrary') {
        interpolationMethod = modifier.value
      }

      return interpolationMethod
    }

    function handleBgLinear({ negative }: { negative: boolean }) {
      return (candidate: Extract<Candidate, { kind: 'functional' }>) => {
        if (!candidate.value) return

        if (candidate.value.kind === 'arbitrary') {
          if (candidate.modifier) return

          let value = candidate.value.value
          let type = candidate.value.dataType ?? inferDataType(value, ['angle'])

          switch (type) {
            case 'angle': {
              value = negative ? `calc(${value} * -1)` : `${value}`

              return [
                decl('--tw-gradient-position', value),
                decl('background-image', `linear-gradient(var(--tw-gradient-stops,${value}))`),
              ]
            }
            default: {
              if (negative) return

              return [
                decl('--tw-gradient-position', value),
                decl('background-image', `linear-gradient(var(--tw-gradient-stops,${value}))`),
              ]
            }
          }
        }

        let value = candidate.value.value

        if (!negative && linearGradientDirections.has(value)) {
          value = linearGradientDirections.get(value)!
        } else if (isPositiveInteger(value)) {
          value = negative ? `calc(${value}deg * -1)` : `${value}deg`
        } else {
          return
        }

        let interpolationMethod = resolveInterpolationModifier(candidate.modifier)

        return [
          decl('--tw-gradient-position', `${value}`),
          rule('@supports (background-image: linear-gradient(in lab, red, red))', [
            decl('--tw-gradient-position', `${value} ${interpolationMethod}`),
          ]),
          decl('background-image', `linear-gradient(var(--tw-gradient-stops))`),
        ]
      }
    }

    utilities.functional('-bg-linear', handleBgLinear({ negative: true }))
    utilities.functional('bg-linear', handleBgLinear({ negative: false }))

    suggest('bg-linear', () => [
      {
        values: [...linearGradientDirections.keys()],
        modifiers: suggestedModifiers,
      },
      {
        values: ['0', '30', '60', '90', '120', '150', '180', '210', '240', '270', '300', '330'],
        supportsNegative: true,
        modifiers: suggestedModifiers,
      },
    ])

    function handleBgConic({ negative }: { negative: boolean }) {
      return (candidate: Extract<Candidate, { kind: 'functional' }>) => {
        if (candidate.value?.kind === 'arbitrary') {
          if (candidate.modifier) return
          let value = candidate.value.value
          return [
            decl('--tw-gradient-position', value),
            decl('background-image', `conic-gradient(var(--tw-gradient-stops,${value}))`),
          ]
        }

        let interpolationMethod = resolveInterpolationModifier(candidate.modifier)

        if (!candidate.value) {
          return [
            decl('--tw-gradient-position', interpolationMethod),
            decl('background-image', `conic-gradient(var(--tw-gradient-stops))`),
          ]
        }

        let value = candidate.value.value

        if (!isPositiveInteger(value)) return

        value = negative ? `calc(${value}deg * -1)` : `${value}deg`

        return [
          decl('--tw-gradient-position', `from ${value} ${interpolationMethod}`),
          decl('background-image', `conic-gradient(var(--tw-gradient-stops))`),
        ]
      }
    }

    utilities.functional('-bg-conic', handleBgConic({ negative: true }))
    utilities.functional('bg-conic', handleBgConic({ negative: false }))

    suggest('bg-conic', () => [
      {
        hasDefaultValue: true,
        modifiers: suggestedModifiers,
      },
      {
        values: ['0', '30', '60', '90', '120', '150', '180', '210', '240', '270', '300', '330'],
        supportsNegative: true,
        modifiers: suggestedModifiers,
      },
    ])

    utilities.functional('bg-radial', (candidate) => {
      if (!candidate.value) {
        let interpolationMethod = resolveInterpolationModifier(candidate.modifier)
        return [
          decl('--tw-gradient-position', interpolationMethod),
          decl('background-image', `radial-gradient(var(--tw-gradient-stops))`),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        if (candidate.modifier) return
        let value = candidate.value.value
        return [
          decl('--tw-gradient-position', value),
          decl('background-image', `radial-gradient(var(--tw-gradient-stops,${value}))`),
        ]
      }
    })

    suggest('bg-radial', () => [
      {
        hasDefaultValue: true,
        modifiers: suggestedModifiers,
      },
    ])
  }

  utilities.functional('bg', (candidate) => {
    if (!candidate.value) return

    // Arbitrary values
    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type =
        candidate.value.dataType ??
        inferDataType(value, [
          'image',
          'color',
          'percentage',
          'position',
          'bg-size',
          'length',
          'url',
        ])

      switch (type) {
        case 'percentage':
        case 'position': {
          if (candidate.modifier) return
          return [decl('background-position', value)]
        }
        case 'bg-size':
        case 'length':
        case 'size': {
          if (candidate.modifier) return
          return [decl('background-size', value)]
        }
        case 'image':
        case 'url': {
          if (candidate.modifier) return
          return [decl('background-image', value)]
        }
        default: {
          value = asColor(value, candidate.modifier, theme)
          if (value === null) return

          return [decl('background-color', value)]
        }
      }
    }

    // `background-color` property
    {
      let value = resolveThemeColor(candidate, theme, ['--background-color', '--color'])
      if (value) {
        return [decl('background-color', value)]
      }
    }

    // `background-image` property
    {
      if (candidate.modifier) return
      let value = theme.resolve(candidate.value.value, ['--background-image'])
      if (value) {
        return [decl('background-image', value)]
      }
    }
  })

  suggest('bg', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--background-color', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
    },
    {
      values: [],
      valueThemeKeys: ['--background-image'],
    },
  ])

  let gradientStopProperties = () => {
    return atRoot([
      property('--tw-gradient-position'),
      property('--tw-gradient-from', '#0000', '<color>'),
      property('--tw-gradient-via', '#0000', '<color>'),
      property('--tw-gradient-to', '#0000', '<color>'),
      property('--tw-gradient-stops'),
      property('--tw-gradient-via-stops'),
      property('--tw-gradient-from-position', '0%', '<length-percentage>'),
      property('--tw-gradient-via-position', '50%', '<length-percentage>'),
      property('--tw-gradient-to-position', '100%', '<length-percentage>'),
    ])
  }

  type GradientStopDescription = {
    color: (value: string) => AstNode[] | undefined
    position: (value: string) => AstNode[] | undefined
  }

  function gradientStopUtility(classRoot: string, desc: GradientStopDescription) {
    utilities.functional(classRoot, (candidate) => {
      if (!candidate.value) return

      // Arbitrary values
      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type =
          candidate.value.dataType ?? inferDataType(value, ['color', 'length', 'percentage'])

        switch (type) {
          case 'length':
          case 'percentage': {
            if (candidate.modifier) return
            return desc.position(value)
          }
          default: {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return desc.color(value)
          }
        }
      }

      // Known values: Color Stops
      {
        let value = resolveThemeColor(candidate, theme, ['--background-color', '--color'])
        if (value) {
          return desc.color(value)
        }
      }

      // Known values: Positions
      {
        if (candidate.modifier) return
        let value = theme.resolve(candidate.value.value, ['--gradient-color-stop-positions'])
        if (value) {
          return desc.position(value)
        } else if (
          candidate.value.value[candidate.value.value.length - 1] === '%' &&
          isPositiveInteger(candidate.value.value.slice(0, -1))
        ) {
          return desc.position(candidate.value.value)
        }
      }
    })

    suggest(classRoot, () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--background-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
      {
        values: Array.from({ length: 21 }, (_, index) => `${index * 5}%`),
        valueThemeKeys: ['--gradient-color-stop-positions'],
      },
    ])
  }

  gradientStopUtility('from', {
    color: (value) => [
      gradientStopProperties(),
      decl('--tw-sort', '--tw-gradient-from'),
      decl('--tw-gradient-from', value),
      decl(
        '--tw-gradient-stops',
        'var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))',
      ),
    ],
    position: (value) => [gradientStopProperties(), decl('--tw-gradient-from-position', value)],
  })
  staticUtility('via-none', [['--tw-gradient-via-stops', 'initial']])
  gradientStopUtility('via', {
    color: (value) => [
      gradientStopProperties(),
      decl('--tw-sort', '--tw-gradient-via'),
      decl('--tw-gradient-via', value),
      decl(
        '--tw-gradient-via-stops',
        'var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)',
      ),
      decl('--tw-gradient-stops', 'var(--tw-gradient-via-stops)'),
    ],
    position: (value) => [gradientStopProperties(), decl('--tw-gradient-via-position', value)],
  })
  gradientStopUtility('to', {
    color: (value) => [
      gradientStopProperties(),
      decl('--tw-sort', '--tw-gradient-to'),
      decl('--tw-gradient-to', value),
      decl(
        '--tw-gradient-stops',
        'var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))',
      ),
    ],
    position: (value) => [gradientStopProperties(), decl('--tw-gradient-to-position', value)],
  })

  /**
   * @css `mask-image`
   */

  staticUtility('mask-none', [['mask-image', 'none']])

  utilities.functional('mask', (candidate) => {
    if (!candidate.value) return
    if (candidate.modifier) return
    if (candidate.value.kind !== 'arbitrary') return

    // Arbitrary values
    let value: string | null = candidate.value.value
    let type =
      candidate.value.dataType ??
      inferDataType(value, ['image', 'percentage', 'position', 'bg-size', 'length', 'url'])

    switch (type) {
      case 'percentage':
      case 'position': {
        if (candidate.modifier) return
        return [decl('mask-position', value)]
      }
      case 'bg-size':
      case 'length':
      case 'size': {
        return [decl('mask-size', value)]
      }
      case 'image':
      case 'url':
      default: {
        return [decl('mask-image', value)]
      }
    }
  })

  /**
   * @css `mask-composite`
   */

  staticUtility('mask-add', [['mask-composite', 'add']])
  staticUtility('mask-subtract', [['mask-composite', 'subtract']])
  staticUtility('mask-intersect', [['mask-composite', 'intersect']])
  staticUtility('mask-exclude', [['mask-composite', 'exclude']])

  /**
   * @css `mask-mode`
   *
   * Sets the "mode" of the mask given by mask-image
   */

  staticUtility('mask-alpha', [['mask-mode', 'alpha']])
  staticUtility('mask-luminance', [['mask-mode', 'luminance']])
  staticUtility('mask-match', [['mask-mode', 'match-source']])

  /**
   * @css `mask-type`
   *
   * Sets the "mode" of the current `<mask>` element
   * Is overridden by `mask-mode` if used
   */
  staticUtility('mask-type-alpha', [['mask-type', 'alpha']])
  staticUtility('mask-type-luminance', [['mask-type', 'luminance']])

  /**
   * @css `mask-size`
   */

  staticUtility('mask-auto', [['mask-size', 'auto']])
  staticUtility('mask-cover', [['mask-size', 'cover']])
  staticUtility('mask-contain', [['mask-size', 'contain']])
  functionalUtility('mask-size', {
    handle(value) {
      if (!value) return
      return [decl('mask-size', value)]
    },
  })

  /**
   * @css `mask-position`
   */

  staticUtility('mask-top', [['mask-position', 'top']])
  staticUtility('mask-top-left', [['mask-position', 'left top']])
  staticUtility('mask-top-right', [['mask-position', 'right top']])
  staticUtility('mask-bottom', [['mask-position', 'bottom']])
  staticUtility('mask-bottom-left', [['mask-position', 'left bottom']])
  staticUtility('mask-bottom-right', [['mask-position', 'right bottom']])
  staticUtility('mask-left', [['mask-position', 'left']])
  staticUtility('mask-right', [['mask-position', 'right']])
  staticUtility('mask-center', [['mask-position', 'center']])
  functionalUtility('mask-position', {
    handle(value) {
      if (!value) return
      return [decl('mask-position', value)]
    },
  })

  /**
   * @css `mask-repeat`
   */

  staticUtility('mask-repeat', [['mask-repeat', 'repeat']])
  staticUtility('mask-no-repeat', [['mask-repeat', 'no-repeat']])
  staticUtility('mask-repeat-x', [['mask-repeat', 'repeat-x']])
  staticUtility('mask-repeat-y', [['mask-repeat', 'repeat-y']])
  staticUtility('mask-repeat-round', [['mask-repeat', 'round']])
  staticUtility('mask-repeat-space', [['mask-repeat', 'space']])

  /**
   * @css `mask-clip`
   */

  staticUtility('mask-clip-border', [['mask-clip', 'border-box']])
  staticUtility('mask-clip-padding', [['mask-clip', 'padding-box']])
  staticUtility('mask-clip-content', [['mask-clip', 'content-box']])
  staticUtility('mask-clip-fill', [['mask-clip', 'fill-box']])
  staticUtility('mask-clip-stroke', [['mask-clip', 'stroke-box']])
  staticUtility('mask-clip-view', [['mask-clip', 'view-box']])
  staticUtility('mask-no-clip', [['mask-clip', 'no-clip']])

  /**
   * @css `mask-origin`
   */

  staticUtility('mask-origin-border', [['mask-origin', 'border-box']])
  staticUtility('mask-origin-padding', [['mask-origin', 'padding-box']])
  staticUtility('mask-origin-content', [['mask-origin', 'content-box']])
  staticUtility('mask-origin-fill', [['mask-origin', 'fill-box']])
  staticUtility('mask-origin-stroke', [['mask-origin', 'stroke-box']])
  staticUtility('mask-origin-view', [['mask-origin', 'view-box']])

  /**
   * @css `mask-image` gradients
   */

  let maskPropertiesGradient = () =>
    atRoot([
      property('--tw-mask-linear', 'linear-gradient(#fff, #fff)'),
      property('--tw-mask-radial', 'linear-gradient(#fff, #fff)'),
      property('--tw-mask-conic', 'linear-gradient(#fff, #fff)'),
    ])

  type MaskStopDescription = {
    color: (value: string) => AstNode[] | undefined
    position: (value: string) => AstNode[] | undefined
  }

  function maskStopUtility(classRoot: string, desc: MaskStopDescription) {
    utilities.functional(classRoot, (candidate) => {
      if (!candidate.value) return

      // Arbitrary values
      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type =
          candidate.value.dataType ?? inferDataType(value, ['length', 'percentage', 'color'])

        switch (type) {
          case 'color': {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return desc.color(value)
          }
          case 'percentage': {
            if (candidate.modifier) return
            if (!isPositiveInteger(value.slice(0, -1))) return

            return desc.position(value)
          }
          default: {
            if (candidate.modifier) return

            return desc.position(value)
          }
        }
      }

      // Known values: Color Stops
      {
        let value = resolveThemeColor(candidate, theme, ['--background-color', '--color'])
        if (value) {
          return desc.color(value)
        }
      }

      // Known values: Positions
      {
        if (candidate.modifier) return

        let type = inferDataType(candidate.value.value, ['number', 'percentage'])
        if (!type) return

        switch (type) {
          case 'number': {
            let multiplier = theme.resolve(null, ['--spacing'])
            if (!multiplier) return
            if (!isValidSpacingMultiplier(candidate.value.value)) return

            return desc.position(`calc(${multiplier} * ${candidate.value.value})`)
          }

          case 'percentage': {
            if (!isPositiveInteger(candidate.value.value.slice(0, -1))) return
            return desc.position(candidate.value.value)
          }

          default: {
            return
          }
        }
      }
    })

    suggest(classRoot, () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--background-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
      {
        values: Array.from({ length: 21 }, (_, index) => `${index * 5}%`),
        valueThemeKeys: ['--gradient-color-stop-positions'],
      },
    ])

    suggest(classRoot, () => [
      // Percentages
      {
        values: Array.from({ length: 21 }, (_, index) => `${index * 5}%`),
      },

      // Spacing Scale
      {
        values: theme.get(['--spacing']) ? DEFAULT_SPACING_SUGGESTIONS : [],
      },

      // Colors
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--background-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
    ])
  }

  /**
   * Edge masks
   */

  let maskPropertiesEdge = () =>
    atRoot([
      property('--tw-mask-left', 'linear-gradient(#fff, #fff)'),
      property('--tw-mask-right', 'linear-gradient(#fff, #fff)'),
      property('--tw-mask-bottom', 'linear-gradient(#fff, #fff)'),
      property('--tw-mask-top', 'linear-gradient(#fff, #fff)'),
    ])

  type MaskEdge = 'top' | 'right' | 'bottom' | 'left'
  type MaskStop = 'from' | 'to'

  function maskEdgeUtility(name: string, stop: MaskStop, edges: Record<MaskEdge, boolean>) {
    maskStopUtility(name, {
      color(value) {
        let nodes: AstNode[] = [
          // Common @property declarations
          maskPropertiesGradient(),
          maskPropertiesEdge(),

          // Common properties to all edge utilities
          decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
          decl('mask-composite', 'intersect'),
          decl(
            '--tw-mask-linear',
            'var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top)',
          ),
        ]

        for (let edge of ['top', 'right', 'bottom', 'left'] as const) {
          if (!edges[edge]) continue

          nodes.push(
            decl(
              `--tw-mask-${edge}`,
              `linear-gradient(to ${edge}, var(--tw-mask-${edge}-from-color) var(--tw-mask-${edge}-from-position), var(--tw-mask-${edge}-to-color) var(--tw-mask-${edge}-to-position))`,
            ),
          )

          nodes.push(
            atRoot([
              property(`--tw-mask-${edge}-from-position`, '0%'),
              property(`--tw-mask-${edge}-to-position`, '100%'),
              property(`--tw-mask-${edge}-from-color`, 'black'),
              property(`--tw-mask-${edge}-to-color`, 'transparent'),
            ]),
          )

          nodes.push(decl(`--tw-mask-${edge}-${stop}-color`, value))
        }

        return nodes
      },
      position(value) {
        let nodes: AstNode[] = [
          // Common @property declarations
          maskPropertiesGradient(),
          maskPropertiesEdge(),

          // Common properties to all edge utilities
          decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
          decl('mask-composite', 'intersect'),
          decl(
            '--tw-mask-linear',
            'var(--tw-mask-left), var(--tw-mask-right), var(--tw-mask-bottom), var(--tw-mask-top)',
          ),
        ]

        for (let edge of ['top', 'right', 'bottom', 'left'] as const) {
          if (!edges[edge]) continue

          nodes.push(
            decl(
              `--tw-mask-${edge}`,
              `linear-gradient(to ${edge}, var(--tw-mask-${edge}-from-color) var(--tw-mask-${edge}-from-position), var(--tw-mask-${edge}-to-color) var(--tw-mask-${edge}-to-position))`,
            ),
          )

          nodes.push(
            atRoot([
              property(`--tw-mask-${edge}-from-position`, '0%'),
              property(`--tw-mask-${edge}-to-position`, '100%'),
              property(`--tw-mask-${edge}-from-color`, 'black'),
              property(`--tw-mask-${edge}-to-color`, 'transparent'),
            ]),
          )

          nodes.push(decl(`--tw-mask-${edge}-${stop}-position`, value))
        }

        return nodes
      },
    })
  }

  maskEdgeUtility('mask-x-from', 'from', { top: false, right: true, bottom: false, left: true })
  maskEdgeUtility('mask-x-to', 'to', { top: false, right: true, bottom: false, left: true })
  maskEdgeUtility('mask-y-from', 'from', { top: true, right: false, bottom: true, left: false })
  maskEdgeUtility('mask-y-to', 'to', { top: true, right: false, bottom: true, left: false })
  maskEdgeUtility('mask-t-from', 'from', { top: true, right: false, bottom: false, left: false })
  maskEdgeUtility('mask-t-to', 'to', { top: true, right: false, bottom: false, left: false })
  maskEdgeUtility('mask-r-from', 'from', { top: false, right: true, bottom: false, left: false })
  maskEdgeUtility('mask-r-to', 'to', { top: false, right: true, bottom: false, left: false })
  maskEdgeUtility('mask-b-from', 'from', { top: false, right: false, bottom: true, left: false })
  maskEdgeUtility('mask-b-to', 'to', { top: false, right: false, bottom: true, left: false })
  maskEdgeUtility('mask-l-from', 'from', { top: false, right: false, bottom: false, left: true })
  maskEdgeUtility('mask-l-to', 'to', { top: false, right: false, bottom: false, left: true })

  /**
   *  Linear Masks
   */

  let maskPropertiesLinear = () =>
    atRoot([
      property('--tw-mask-linear-position', '0deg'),
      property('--tw-mask-linear-from-position', '0%'),
      property('--tw-mask-linear-to-position', '100%'),
      property('--tw-mask-linear-from-color', 'black'),
      property('--tw-mask-linear-to-color', 'transparent'),
    ])

  functionalUtility('mask-linear', {
    defaultValue: null,
    supportsNegative: true,
    supportsFractions: false,
    handleBareValue(value) {
      if (!isPositiveInteger(value.value)) return null
      return `calc(1deg * ${value.value})`
    },
    handleNegativeBareValue(value) {
      if (!isPositiveInteger(value.value)) return null
      return `calc(1deg * -${value.value})`
    },
    handle: (value) => [
      maskPropertiesGradient(),
      maskPropertiesLinear(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-linear',
        `linear-gradient(var(--tw-mask-linear-stops, var(--tw-mask-linear-position)))`,
      ),
      decl('--tw-mask-linear-position', value),
    ],
  })

  suggest('mask-linear', () => [
    {
      supportsNegative: true,
      values: ['0', '1', '2', '3', '6', '12', '45', '90', '180'],
    },
  ])

  maskStopUtility('mask-linear-from', {
    color: (value) => [
      maskPropertiesGradient(),
      maskPropertiesLinear(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-linear-stops',
        'var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)',
      ),
      decl('--tw-mask-linear', 'linear-gradient(var(--tw-mask-linear-stops))'),
      decl('--tw-mask-linear-from-color', value),
    ],
    position: (value) => [
      maskPropertiesGradient(),
      maskPropertiesLinear(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-linear-stops',
        'var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)',
      ),
      decl('--tw-mask-linear', 'linear-gradient(var(--tw-mask-linear-stops))'),
      decl('--tw-mask-linear-from-position', value),
    ],
  })

  maskStopUtility('mask-linear-to', {
    color: (value) => [
      maskPropertiesGradient(),
      maskPropertiesLinear(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-linear-stops',
        'var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)',
      ),
      decl('--tw-mask-linear', 'linear-gradient(var(--tw-mask-linear-stops))'),
      decl('--tw-mask-linear-to-color', value),
    ],
    position: (value) => [
      maskPropertiesGradient(),
      maskPropertiesLinear(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-linear-stops',
        'var(--tw-mask-linear-position), var(--tw-mask-linear-from-color) var(--tw-mask-linear-from-position), var(--tw-mask-linear-to-color) var(--tw-mask-linear-to-position)',
      ),
      decl('--tw-mask-linear', 'linear-gradient(var(--tw-mask-linear-stops))'),
      decl('--tw-mask-linear-to-position', value),
    ],
  })

  /**
   * Radial masks
   */

  let maskPropertiesRadial = () =>
    atRoot([
      property('--tw-mask-radial-from-position', '0%'),
      property('--tw-mask-radial-to-position', '100%'),
      property('--tw-mask-radial-from-color', 'black'),
      property('--tw-mask-radial-to-color', 'transparent'),
      property('--tw-mask-radial-shape', 'ellipse'),
      property('--tw-mask-radial-size', 'farthest-corner'),
      property('--tw-mask-radial-position', 'center'),
    ])

  staticUtility('mask-circle', [['--tw-mask-radial-shape', 'circle']])
  staticUtility('mask-ellipse', [['--tw-mask-radial-shape', 'ellipse']])
  staticUtility('mask-radial-closest-side', [['--tw-mask-radial-size', 'closest-side']])
  staticUtility('mask-radial-farthest-side', [['--tw-mask-radial-size', 'farthest-side']])
  staticUtility('mask-radial-closest-corner', [['--tw-mask-radial-size', 'closest-corner']])
  staticUtility('mask-radial-farthest-corner', [['--tw-mask-radial-size', 'farthest-corner']])
  staticUtility('mask-radial-at-top', [['--tw-mask-radial-position', 'top']])
  staticUtility('mask-radial-at-top-left', [['--tw-mask-radial-position', 'top left']])
  staticUtility('mask-radial-at-top-right', [['--tw-mask-radial-position', 'top right']])
  staticUtility('mask-radial-at-bottom', [['--tw-mask-radial-position', 'bottom']])
  staticUtility('mask-radial-at-bottom-left', [['--tw-mask-radial-position', 'bottom left']])
  staticUtility('mask-radial-at-bottom-right', [['--tw-mask-radial-position', 'bottom right']])
  staticUtility('mask-radial-at-left', [['--tw-mask-radial-position', 'left']])
  staticUtility('mask-radial-at-right', [['--tw-mask-radial-position', 'right']])
  staticUtility('mask-radial-at-center', [['--tw-mask-radial-position', 'center']])
  functionalUtility('mask-radial-at', {
    defaultValue: null,
    supportsNegative: false,
    supportsFractions: false,
    handle: (value) => [decl('--tw-mask-radial-position', value)],
  })

  /*
      This can be used to set just the size in conjunction with `mask-radial-from-*` et al,
      or can set the whole gradient if it's the only utility you use.

      For example:
      `mask-radial-[40px_80px] mask-radial-from-50%`
      `mask-radial-[96px_at_top,black_40%,transparent_80%,black_90%]`

      This will produce nonsense though and break, which is fine:
      `mask-radial-[96px_at_top,black_40%,transparent_80%,black_90%]  mask-radial-from-50%`
    */
  functionalUtility('mask-radial', {
    defaultValue: null,
    supportsNegative: false,
    supportsFractions: false,
    handle: (value) => [
      maskPropertiesGradient(),
      maskPropertiesRadial(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-radial',
        'radial-gradient(var(--tw-mask-radial-stops, var(--tw-mask-radial-size)))',
      ),
      decl('--tw-mask-radial-size', value),
    ],
  })

  maskStopUtility('mask-radial-from', {
    color: (value) => [
      maskPropertiesGradient(),
      maskPropertiesRadial(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-radial-stops',
        'var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)',
      ),
      decl('--tw-mask-radial', 'radial-gradient(var(--tw-mask-radial-stops))'),
      decl('--tw-mask-radial-from-color', value),
    ],
    position: (value) => [
      maskPropertiesGradient(),
      maskPropertiesRadial(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-radial-stops',
        'var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)',
      ),
      decl('--tw-mask-radial', 'radial-gradient(var(--tw-mask-radial-stops))'),
      decl('--tw-mask-radial-from-position', value),
    ],
  })

  maskStopUtility('mask-radial-to', {
    color: (value) => [
      maskPropertiesGradient(),
      maskPropertiesRadial(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-radial-stops',
        'var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)',
      ),
      decl('--tw-mask-radial', 'radial-gradient(var(--tw-mask-radial-stops))'),
      decl('--tw-mask-radial-to-color', value),
    ],
    position: (value) => [
      maskPropertiesGradient(),
      maskPropertiesRadial(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-radial-stops',
        'var(--tw-mask-radial-shape) var(--tw-mask-radial-size) at var(--tw-mask-radial-position), var(--tw-mask-radial-from-color) var(--tw-mask-radial-from-position), var(--tw-mask-radial-to-color) var(--tw-mask-radial-to-position)',
      ),
      decl('--tw-mask-radial', 'radial-gradient(var(--tw-mask-radial-stops))'),
      decl('--tw-mask-radial-to-position', value),
    ],
  })

  /**
   * Conic masks
   */

  let maskPropertiesConic = () =>
    atRoot([
      property('--tw-mask-conic-position', '0deg'),
      property('--tw-mask-conic-from-position', '0%'),
      property('--tw-mask-conic-to-position', '100%'),
      property('--tw-mask-conic-from-color', 'black'),
      property('--tw-mask-conic-to-color', 'transparent'),
    ])

  functionalUtility('mask-conic', {
    defaultValue: null,
    supportsNegative: true,
    supportsFractions: false,
    handleBareValue(value) {
      if (!isPositiveInteger(value.value)) return null
      return `calc(1deg * ${value.value})`
    },
    handleNegativeBareValue(value) {
      if (!isPositiveInteger(value.value)) return null
      return `calc(1deg * -${value.value})`
    },
    handle: (value) => [
      maskPropertiesGradient(),
      maskPropertiesConic(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-conic',
        'conic-gradient(var(--tw-mask-conic-stops, var(--tw-mask-conic-position)))',
      ),
      decl('--tw-mask-conic-position', value),
    ],
  })

  suggest('mask-conic', () => [
    {
      supportsNegative: true,
      values: ['0', '1', '2', '3', '6', '12', '45', '90', '180'],
    },
  ])

  maskStopUtility('mask-conic-from', {
    color: (value) => [
      maskPropertiesGradient(),
      maskPropertiesConic(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-conic-stops',
        'from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)',
      ),
      decl('--tw-mask-conic', 'conic-gradient(var(--tw-mask-conic-stops))'),
      decl('--tw-mask-conic-from-color', value),
    ],
    position: (value) => [
      maskPropertiesGradient(),
      maskPropertiesConic(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-conic-stops',
        'from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)',
      ),
      decl('--tw-mask-conic', 'conic-gradient(var(--tw-mask-conic-stops))'),
      decl('--tw-mask-conic-from-position', value),
    ],
  })

  maskStopUtility('mask-conic-to', {
    color: (value) => [
      maskPropertiesGradient(),
      maskPropertiesConic(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-conic-stops',
        'from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)',
      ),
      decl('--tw-mask-conic', 'conic-gradient(var(--tw-mask-conic-stops))'),
      decl('--tw-mask-conic-to-color', value),
    ],
    position: (value) => [
      maskPropertiesGradient(),
      maskPropertiesConic(),
      decl('mask-image', 'var(--tw-mask-linear), var(--tw-mask-radial), var(--tw-mask-conic)'),
      decl('mask-composite', 'intersect'),
      decl(
        '--tw-mask-conic-stops',
        'from var(--tw-mask-conic-position), var(--tw-mask-conic-from-color) var(--tw-mask-conic-from-position), var(--tw-mask-conic-to-color) var(--tw-mask-conic-to-position)',
      ),
      decl('--tw-mask-conic', 'conic-gradient(var(--tw-mask-conic-stops))'),
      decl('--tw-mask-conic-to-position', value),
    ],
  })

  /**
   * @css `box-decoration-break`
   */
  staticUtility('box-decoration-slice', [
    ['-webkit-box-decoration-break', 'slice'],
    ['box-decoration-break', 'slice'],
  ])
  staticUtility('box-decoration-clone', [
    ['-webkit-box-decoration-break', 'clone'],
    ['box-decoration-break', 'clone'],
  ])

  /**
   * @css `background-clip`
   */
  staticUtility('bg-clip-text', [['background-clip', 'text']])
  staticUtility('bg-clip-border', [['background-clip', 'border-box']])
  staticUtility('bg-clip-padding', [['background-clip', 'padding-box']])
  staticUtility('bg-clip-content', [['background-clip', 'content-box']])

  staticUtility('bg-origin-border', [['background-origin', 'border-box']])
  staticUtility('bg-origin-padding', [['background-origin', 'padding-box']])
  staticUtility('bg-origin-content', [['background-origin', 'content-box']])

  for (let value of [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
  ]) {
    staticUtility(`bg-blend-${value}`, [['background-blend-mode', value]])
    staticUtility(`mix-blend-${value}`, [['mix-blend-mode', value]])
  }

  staticUtility('mix-blend-plus-darker', [['mix-blend-mode', 'plus-darker']])
  staticUtility('mix-blend-plus-lighter', [['mix-blend-mode', 'plus-lighter']])

  staticUtility('fill-none', [['fill', 'none']])
  utilities.functional('fill', (candidate) => {
    if (!candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      let value = asColor(candidate.value.value, candidate.modifier, theme)
      if (value === null) return
      return [decl('fill', value)]
    }

    let value = resolveThemeColor(candidate, theme, ['--fill', '--color'])
    if (value) {
      return [decl('fill', value)]
    }
  })

  suggest('fill', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--fill', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
    },
  ])

  staticUtility('stroke-none', [['stroke', 'none']])
  utilities.functional('stroke', (candidate) => {
    if (!candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type =
        candidate.value.dataType ??
        inferDataType(value, ['color', 'number', 'length', 'percentage'])

      switch (type) {
        case 'number':
        case 'length':
        case 'percentage': {
          if (candidate.modifier) return
          return [decl('stroke-width', value)]
        }
        default: {
          value = asColor(candidate.value.value, candidate.modifier, theme)
          if (value === null) return

          return [decl('stroke', value)]
        }
      }
    }

    {
      let value = resolveThemeColor(candidate, theme, ['--stroke', '--color'])
      if (value) {
        return [decl('stroke', value)]
      }
    }

    {
      let value = theme.resolve(candidate.value.value, ['--stroke-width'])
      if (value) {
        return [decl('stroke-width', value)]
      } else if (isPositiveInteger(candidate.value.value)) {
        return [decl('stroke-width', candidate.value.value)]
      }
    }
  })

  suggest('stroke', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--stroke', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
    },
    {
      values: ['0', '1', '2', '3'],
      valueThemeKeys: ['--stroke-width'],
    },
  ])

  staticUtility('object-contain', [['object-fit', 'contain']])
  staticUtility('object-cover', [['object-fit', 'cover']])
  staticUtility('object-fill', [['object-fit', 'fill']])
  staticUtility('object-none', [['object-fit', 'none']])
  staticUtility('object-scale-down', [['object-fit', 'scale-down']])

  staticUtility('object-top', [['object-position', 'top']])
  staticUtility('object-top-left', [['object-position', 'left top']])
  staticUtility('object-top-right', [['object-position', 'right top']])
  staticUtility('object-bottom', [['object-position', 'bottom']])
  staticUtility('object-bottom-left', [['object-position', 'left bottom']])
  staticUtility('object-bottom-right', [['object-position', 'right bottom']])
  staticUtility('object-left', [['object-position', 'left']])
  staticUtility('object-right', [['object-position', 'right']])
  staticUtility('object-center', [['object-position', 'center']])
  functionalUtility('object', {
    themeKeys: ['--object-position'],
    handle: (value) => [decl('object-position', value)],
  })

  for (let [name, property] of [
    ['p', 'padding'],
    ['px', 'padding-inline'],
    ['py', 'padding-block'],
    ['ps', 'padding-inline-start'],
    ['pe', 'padding-inline-end'],
    ['pt', 'padding-top'],
    ['pr', 'padding-right'],
    ['pb', 'padding-bottom'],
    ['pl', 'padding-left'],
  ] as const) {
    spacingUtility(name, ['--padding', '--spacing'], (value) => [decl(property, value)])
  }

  staticUtility('text-left', [['text-align', 'left']])
  staticUtility('text-center', [['text-align', 'center']])
  staticUtility('text-right', [['text-align', 'right']])
  staticUtility('text-justify', [['text-align', 'justify']])
  staticUtility('text-start', [['text-align', 'start']])
  staticUtility('text-end', [['text-align', 'end']])

  spacingUtility(
    'indent',
    ['--text-indent', '--spacing'],
    (value) => [decl('text-indent', value)],
    {
      supportsNegative: true,
    },
  )

  staticUtility('align-baseline', [['vertical-align', 'baseline']])
  staticUtility('align-top', [['vertical-align', 'top']])
  staticUtility('align-middle', [['vertical-align', 'middle']])
  staticUtility('align-bottom', [['vertical-align', 'bottom']])
  staticUtility('align-text-top', [['vertical-align', 'text-top']])
  staticUtility('align-text-bottom', [['vertical-align', 'text-bottom']])
  staticUtility('align-sub', [['vertical-align', 'sub']])
  staticUtility('align-super', [['vertical-align', 'super']])

  functionalUtility('align', {
    themeKeys: [],
    handle: (value) => [decl('vertical-align', value)],
  })

  utilities.functional('font', (candidate) => {
    if (!candidate.value || candidate.modifier) return

    if (candidate.value.kind === 'arbitrary') {
      let value = candidate.value.value
      let type =
        candidate.value.dataType ?? inferDataType(value, ['number', 'generic-name', 'family-name'])

      switch (type) {
        case 'generic-name':
        case 'family-name': {
          return [decl('font-family', value)]
        }
        default: {
          return [
            atRoot([property('--tw-font-weight')]),
            decl('--tw-font-weight', value),
            decl('font-weight', value),
          ]
        }
      }
    }

    {
      let value = theme.resolveWith(
        candidate.value.value,
        ['--font'],
        ['--font-feature-settings', '--font-variation-settings'],
      )
      if (value) {
        let [families, options = {}] = value

        return [
          decl('font-family', families),
          decl('font-feature-settings', options['--font-feature-settings']),
          decl('font-variation-settings', options['--font-variation-settings']),
        ]
      }
    }

    {
      let value = theme.resolve(candidate.value.value, ['--font-weight'])
      if (value) {
        return [
          atRoot([property('--tw-font-weight')]),
          decl('--tw-font-weight', value),
          decl('font-weight', value),
        ]
      }
    }
  })

  suggest('font', () => [
    {
      values: [],
      valueThemeKeys: ['--font'],
    },
    {
      values: [],
      valueThemeKeys: ['--font-weight'],
    },
  ])

  staticUtility('uppercase', [['text-transform', 'uppercase']])
  staticUtility('lowercase', [['text-transform', 'lowercase']])
  staticUtility('capitalize', [['text-transform', 'capitalize']])
  staticUtility('normal-case', [['text-transform', 'none']])

  staticUtility('italic', [['font-style', 'italic']])
  staticUtility('not-italic', [['font-style', 'normal']])
  staticUtility('underline', [['text-decoration-line', 'underline']])
  staticUtility('overline', [['text-decoration-line', 'overline']])
  staticUtility('line-through', [['text-decoration-line', 'line-through']])
  staticUtility('no-underline', [['text-decoration-line', 'none']])

  staticUtility('font-stretch-normal', [['font-stretch', 'normal']])
  staticUtility('font-stretch-ultra-condensed', [['font-stretch', 'ultra-condensed']])
  staticUtility('font-stretch-extra-condensed', [['font-stretch', 'extra-condensed']])
  staticUtility('font-stretch-condensed', [['font-stretch', 'condensed']])
  staticUtility('font-stretch-semi-condensed', [['font-stretch', 'semi-condensed']])
  staticUtility('font-stretch-semi-expanded', [['font-stretch', 'semi-expanded']])
  staticUtility('font-stretch-expanded', [['font-stretch', 'expanded']])
  staticUtility('font-stretch-extra-expanded', [['font-stretch', 'extra-expanded']])
  staticUtility('font-stretch-ultra-expanded', [['font-stretch', 'ultra-expanded']])
  functionalUtility('font-stretch', {
    handleBareValue: ({ value }) => {
      if (!value.endsWith('%')) return null
      let num = Number(value.slice(0, -1))
      if (!isPositiveInteger(num)) return null
      // Only 50-200% (inclusive) are valid:
      // https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch#percentage
      if (Number.isNaN(num) || num < 50 || num > 200) return null
      return value
    },
    handle: (value) => [decl('font-stretch', value)],
  })
  suggest('font-stretch', () => [
    {
      values: ['50%', '75%', '90%', '95%', '100%', '105%', '110%', '125%', '150%', '200%'],
    },
  ])

  colorUtility('placeholder', {
    themeKeys: ['--background-color', '--color'],
    handle: (value) => [
      styleRule('&::placeholder', [decl('--tw-sort', 'placeholder-color'), decl('color', value)]),
    ],
  })

  /**
   * @css `text-decoration-style`
   */
  staticUtility('decoration-solid', [['text-decoration-style', 'solid']])
  staticUtility('decoration-double', [['text-decoration-style', 'double']])
  staticUtility('decoration-dotted', [['text-decoration-style', 'dotted']])
  staticUtility('decoration-dashed', [['text-decoration-style', 'dashed']])
  staticUtility('decoration-wavy', [['text-decoration-style', 'wavy']])

  /**
   * @css `text-decoration-thickness`
   */
  staticUtility('decoration-auto', [['text-decoration-thickness', 'auto']])
  staticUtility('decoration-from-font', [['text-decoration-thickness', 'from-font']])

  utilities.functional('decoration', (candidate) => {
    if (!candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type = candidate.value.dataType ?? inferDataType(value, ['color', 'length', 'percentage'])

      switch (type) {
        case 'length':
        case 'percentage': {
          if (candidate.modifier) return
          return [decl('text-decoration-thickness', value)]
        }
        default: {
          value = asColor(value, candidate.modifier, theme)
          if (value === null) return

          return [decl('text-decoration-color', value)]
        }
      }
    }

    // `text-decoration-thickness` property
    {
      let value = theme.resolve(candidate.value.value, ['--text-decoration-thickness'])
      if (value) {
        if (candidate.modifier) return
        return [decl('text-decoration-thickness', value)]
      }

      if (isPositiveInteger(candidate.value.value)) {
        if (candidate.modifier) return
        return [decl('text-decoration-thickness', `${candidate.value.value}px`)]
      }
    }

    // `text-decoration-color` property
    {
      let value = resolveThemeColor(candidate, theme, ['--text-decoration-color', '--color'])
      if (value) {
        return [decl('text-decoration-color', value)]
      }
    }
  })

  suggest('decoration', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--text-decoration-color', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
    },
    {
      values: ['0', '1', '2'],
      valueThemeKeys: ['--text-decoration-thickness'],
    },
  ])

  staticUtility('animate-none', [['animation', 'none']])
  functionalUtility('animate', {
    themeKeys: ['--animate'],
    handle: (value) => [decl('animation', value)],
  })

  {
    let cssFilterValue = [
      'var(--tw-blur,)',
      'var(--tw-brightness,)',
      'var(--tw-contrast,)',
      'var(--tw-grayscale,)',
      'var(--tw-hue-rotate,)',
      'var(--tw-invert,)',
      'var(--tw-saturate,)',
      'var(--tw-sepia,)',
      'var(--tw-drop-shadow,)',
    ].join(' ')

    let cssBackdropFilterValue = [
      'var(--tw-backdrop-blur,)',
      'var(--tw-backdrop-brightness,)',
      'var(--tw-backdrop-contrast,)',
      'var(--tw-backdrop-grayscale,)',
      'var(--tw-backdrop-hue-rotate,)',
      'var(--tw-backdrop-invert,)',
      'var(--tw-backdrop-opacity,)',
      'var(--tw-backdrop-saturate,)',
      'var(--tw-backdrop-sepia,)',
    ].join(' ')

    let filterProperties = () => {
      return atRoot([
        property('--tw-blur'),
        property('--tw-brightness'),
        property('--tw-contrast'),
        property('--tw-grayscale'),
        property('--tw-hue-rotate'),
        property('--tw-invert'),
        property('--tw-opacity'),
        property('--tw-saturate'),
        property('--tw-sepia'),
        property('--tw-drop-shadow'),
        property('--tw-drop-shadow-color'),
        property('--tw-drop-shadow-alpha', '100%', '<percentage>'),
        property('--tw-drop-shadow-size'),
      ])
    }

    let backdropFilterProperties = () => {
      return atRoot([
        property('--tw-backdrop-blur'),
        property('--tw-backdrop-brightness'),
        property('--tw-backdrop-contrast'),
        property('--tw-backdrop-grayscale'),
        property('--tw-backdrop-hue-rotate'),
        property('--tw-backdrop-invert'),
        property('--tw-backdrop-opacity'),
        property('--tw-backdrop-saturate'),
        property('--tw-backdrop-sepia'),
      ])
    }

    utilities.functional('filter', (candidate) => {
      if (candidate.modifier) return

      if (candidate.value === null) {
        return [filterProperties(), decl('filter', cssFilterValue)]
      }

      if (candidate.value.kind === 'arbitrary') {
        return [decl('filter', candidate.value.value)]
      }

      switch (candidate.value.value) {
        case 'none':
          return [decl('filter', 'none')]
      }
    })

    utilities.functional('backdrop-filter', (candidate) => {
      if (candidate.modifier) return

      if (candidate.value === null) {
        return [
          backdropFilterProperties(),
          decl('-webkit-backdrop-filter', cssBackdropFilterValue),
          decl('backdrop-filter', cssBackdropFilterValue),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        return [
          decl('-webkit-backdrop-filter', candidate.value.value),
          decl('backdrop-filter', candidate.value.value),
        ]
      }

      switch (candidate.value.value) {
        case 'none':
          return [decl('-webkit-backdrop-filter', 'none'), decl('backdrop-filter', 'none')]
      }
    })

    functionalUtility('blur', {
      themeKeys: ['--blur'],
      handle: (value) => [
        filterProperties(),
        decl('--tw-blur', `blur(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    staticUtility('blur-none', [filterProperties, ['--tw-blur', ' '], ['filter', cssFilterValue]])

    functionalUtility('backdrop-blur', {
      themeKeys: ['--backdrop-blur', '--blur'],
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-blur', `blur(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    staticUtility('backdrop-blur-none', [
      backdropFilterProperties,
      ['--tw-backdrop-blur', ' '],
      ['-webkit-backdrop-filter', cssBackdropFilterValue],
      ['backdrop-filter', cssBackdropFilterValue],
    ])

    functionalUtility('brightness', {
      themeKeys: ['--brightness'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        filterProperties(),
        decl('--tw-brightness', `brightness(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-brightness', {
      themeKeys: ['--backdrop-brightness', '--brightness'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-brightness', `brightness(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('brightness', () => [
      {
        values: ['0', '50', '75', '90', '95', '100', '105', '110', '125', '150', '200'],
        valueThemeKeys: ['--brightness'],
      },
    ])

    suggest('backdrop-brightness', () => [
      {
        values: ['0', '50', '75', '90', '95', '100', '105', '110', '125', '150', '200'],
        valueThemeKeys: ['--backdrop-brightness', '--brightness'],
      },
    ])

    functionalUtility('contrast', {
      themeKeys: ['--contrast'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        filterProperties(),
        decl('--tw-contrast', `contrast(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-contrast', {
      themeKeys: ['--backdrop-contrast', '--contrast'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-contrast', `contrast(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('contrast', () => [
      {
        values: ['0', '50', '75', '100', '125', '150', '200'],
        valueThemeKeys: ['--contrast'],
      },
    ])

    suggest('backdrop-contrast', () => [
      {
        values: ['0', '50', '75', '100', '125', '150', '200'],
        valueThemeKeys: ['--backdrop-contrast', '--contrast'],
      },
    ])

    functionalUtility('grayscale', {
      themeKeys: ['--grayscale'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      defaultValue: '100%',
      handle: (value) => [
        filterProperties(),
        decl('--tw-grayscale', `grayscale(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-grayscale', {
      themeKeys: ['--backdrop-grayscale', '--grayscale'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      defaultValue: '100%',
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-grayscale', `grayscale(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('grayscale', () => [
      {
        values: ['0', '25', '50', '75', '100'],
        valueThemeKeys: ['--grayscale'],
        hasDefaultValue: true,
      },
    ])

    suggest('backdrop-grayscale', () => [
      {
        values: ['0', '25', '50', '75', '100'],
        valueThemeKeys: ['--backdrop-grayscale', '--grayscale'],
        hasDefaultValue: true,
      },
    ])

    functionalUtility('hue-rotate', {
      supportsNegative: true,
      themeKeys: ['--hue-rotate'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}deg`
      },
      handle: (value) => [
        filterProperties(),
        decl('--tw-hue-rotate', `hue-rotate(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-hue-rotate', {
      supportsNegative: true,
      themeKeys: ['--backdrop-hue-rotate', '--hue-rotate'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}deg`
      },
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-hue-rotate', `hue-rotate(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('hue-rotate', () => [
      {
        values: ['0', '15', '30', '60', '90', '180'],
        valueThemeKeys: ['--hue-rotate'],
      },
    ])

    suggest('backdrop-hue-rotate', () => [
      {
        values: ['0', '15', '30', '60', '90', '180'],
        valueThemeKeys: ['--backdrop-hue-rotate', '--hue-rotate'],
      },
    ])

    functionalUtility('invert', {
      themeKeys: ['--invert'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      defaultValue: '100%',
      handle: (value) => [
        filterProperties(),
        decl('--tw-invert', `invert(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-invert', {
      themeKeys: ['--backdrop-invert', '--invert'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      defaultValue: '100%',
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-invert', `invert(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('invert', () => [
      {
        values: ['0', '25', '50', '75', '100'],
        valueThemeKeys: ['--invert'],
        hasDefaultValue: true,
      },
    ])

    suggest('backdrop-invert', () => [
      {
        values: ['0', '25', '50', '75', '100'],
        valueThemeKeys: ['--backdrop-invert', '--invert'],
        hasDefaultValue: true,
      },
    ])

    functionalUtility('saturate', {
      themeKeys: ['--saturate'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        filterProperties(),
        decl('--tw-saturate', `saturate(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-saturate', {
      themeKeys: ['--backdrop-saturate', '--saturate'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-saturate', `saturate(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('saturate', () => [
      {
        values: ['0', '50', '100', '150', '200'],
        valueThemeKeys: ['--saturate'],
      },
    ])

    suggest('backdrop-saturate', () => [
      {
        values: ['0', '50', '100', '150', '200'],
        valueThemeKeys: ['--backdrop-saturate', '--saturate'],
      },
    ])

    functionalUtility('sepia', {
      themeKeys: ['--sepia'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      defaultValue: '100%',
      handle: (value) => [
        filterProperties(),
        decl('--tw-sepia', `sepia(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-sepia', {
      themeKeys: ['--backdrop-sepia', '--sepia'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}%`
      },
      defaultValue: '100%',
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-sepia', `sepia(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('sepia', () => [
      {
        values: ['0', '50', '100'],
        valueThemeKeys: ['--sepia'],
        hasDefaultValue: true,
      },
    ])

    suggest('backdrop-sepia', () => [
      {
        values: ['0', '50', '100'],
        valueThemeKeys: ['--backdrop-sepia', '--sepia'],
        hasDefaultValue: true,
      },
    ])

    staticUtility('drop-shadow-none', [
      filterProperties,
      ['--tw-drop-shadow', ' '],
      ['filter', cssFilterValue],
    ])

    utilities.functional('drop-shadow', (candidate) => {
      let alpha: string | undefined

      if (candidate.modifier) {
        if (candidate.modifier.kind === 'arbitrary') {
          alpha = candidate.modifier.value
        } else {
          if (isPositiveInteger(candidate.modifier.value)) {
            alpha = `${candidate.modifier.value}%`
          }
        }
      }

      if (!candidate.value) {
        let value = theme.get(['--drop-shadow'])
        let resolved = theme.resolve(null, ['--drop-shadow'])
        if (value === null || resolved === null) return

        return [
          filterProperties(),
          decl('--tw-drop-shadow-alpha', alpha),
          ...alphaReplacedDropShadowProperties(
            '--tw-drop-shadow-size',
            value,
            alpha,
            (color) => `var(--tw-drop-shadow-color, ${color})`,
          ),
          decl(
            '--tw-drop-shadow',
            segment(resolved, ',')
              .map((value) => `drop-shadow(${value})`)
              .join(' '),
          ),
          decl('filter', cssFilterValue),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['color'])

        switch (type) {
          case 'color': {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return
            return [
              filterProperties(),
              decl('--tw-drop-shadow-color', withAlpha(value, 'var(--tw-drop-shadow-alpha)')),
              decl('--tw-drop-shadow', `var(--tw-drop-shadow-size)`),
            ]
          }
          default: {
            if (candidate.modifier && !alpha) return

            return [
              filterProperties(),
              decl('--tw-drop-shadow-alpha', alpha),
              ...alphaReplacedDropShadowProperties(
                '--tw-drop-shadow-size',
                value,
                alpha,
                (color) => `var(--tw-drop-shadow-color, ${color})`,
              ),
              decl('--tw-drop-shadow', `var(--tw-drop-shadow-size)`),
              decl('filter', cssFilterValue),
            ]
          }
        }
      }

      // Shadow size
      {
        let value = theme.get([`--drop-shadow-${candidate.value.value}`])
        let resolved = theme.resolve(candidate.value.value, ['--drop-shadow'])
        if (value && resolved) {
          if (candidate.modifier && !alpha) return

          if (alpha) {
            return [
              filterProperties(),
              decl('--tw-drop-shadow-alpha', alpha),
              ...alphaReplacedDropShadowProperties(
                '--tw-drop-shadow-size',
                value,
                alpha,
                (color) => `var(--tw-drop-shadow-color, ${color})`,
              ),
              decl('--tw-drop-shadow', `var(--tw-drop-shadow-size)`),
              decl('filter', cssFilterValue),
            ]
          }

          return [
            filterProperties(),
            decl('--tw-drop-shadow-alpha', alpha),
            ...alphaReplacedDropShadowProperties(
              '--tw-drop-shadow-size',
              value,
              alpha,
              (color) => `var(--tw-drop-shadow-color, ${color})`,
            ),
            decl(
              '--tw-drop-shadow',
              segment(resolved, ',')
                .map((value) => `drop-shadow(${value})`)
                .join(' '),
            ),
            decl('filter', cssFilterValue),
          ]
        }
      }

      // Shadow color
      {
        let value = resolveThemeColor(candidate, theme, ['--drop-shadow-color', '--color'])
        if (value) {
          if (value === 'inherit') {
            return [
              filterProperties(),
              decl('--tw-drop-shadow-color', 'inherit'),
              decl('--tw-drop-shadow', `var(--tw-drop-shadow-size)`),
            ]
          }

          return [
            filterProperties(),
            decl('--tw-drop-shadow-color', withAlpha(value, 'var(--tw-drop-shadow-alpha)')),
            decl('--tw-drop-shadow', `var(--tw-drop-shadow-size)`),
          ]
        }
      }
    })

    suggest('drop-shadow', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--drop-shadow-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
      {
        valueThemeKeys: ['--drop-shadow'],
      },
    ])

    functionalUtility('backdrop-opacity', {
      themeKeys: ['--backdrop-opacity', '--opacity'],
      handleBareValue: ({ value }) => {
        if (!isValidOpacityValue(value)) return null
        return `${value}%`
      },
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-opacity', `opacity(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    suggest('backdrop-opacity', () => [
      {
        values: Array.from({ length: 21 }, (_, i) => `${i * 5}`),
        valueThemeKeys: ['--backdrop-opacity', '--opacity'],
      },
    ])
  }

  {
    let defaultTimingFunction = `var(--tw-ease, ${theme.resolve(null, ['--default-transition-timing-function']) ?? 'ease'})`
    let defaultDuration = `var(--tw-duration, ${theme.resolve(null, ['--default-transition-duration']) ?? '0s'})`

    staticUtility('transition-none', [['transition-property', 'none']])
    staticUtility('transition-all', [
      ['transition-property', 'all'],
      ['transition-timing-function', defaultTimingFunction],
      ['transition-duration', defaultDuration],
    ])
    staticUtility('transition-colors', [
      [
        'transition-property',
        'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to',
      ],
      ['transition-timing-function', defaultTimingFunction],
      ['transition-duration', defaultDuration],
    ])
    staticUtility('transition-opacity', [
      ['transition-property', 'opacity'],
      ['transition-timing-function', defaultTimingFunction],
      ['transition-duration', defaultDuration],
    ])
    staticUtility('transition-shadow', [
      ['transition-property', 'box-shadow'],
      ['transition-timing-function', defaultTimingFunction],
      ['transition-duration', defaultDuration],
    ])
    staticUtility('transition-transform', [
      ['transition-property', 'transform, translate, scale, rotate'],
      ['transition-timing-function', defaultTimingFunction],
      ['transition-duration', defaultDuration],
    ])

    functionalUtility('transition', {
      defaultValue:
        'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter',
      themeKeys: ['--transition-property'],
      handle: (value) => [
        decl('transition-property', value),
        decl('transition-timing-function', defaultTimingFunction),
        decl('transition-duration', defaultDuration),
      ],
    })

    staticUtility('transition-discrete', [['transition-behavior', 'allow-discrete']])
    staticUtility('transition-normal', [['transition-behavior', 'normal']])

    functionalUtility('delay', {
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}ms`
      },
      themeKeys: ['--transition-delay'],
      handle: (value) => [decl('transition-delay', value)],
    })

    {
      let transitionDurationProperty = () => {
        return atRoot([property('--tw-duration')])
      }

      staticUtility('duration-initial', [transitionDurationProperty, ['--tw-duration', 'initial']])

      utilities.functional('duration', (candidate) => {
        // This utility doesn't support modifiers.
        if (candidate.modifier) return

        // This utility doesn't support `DEFAULT` values.
        if (!candidate.value) return

        // Find the actual CSS value that the candidate value maps to.
        let value: string | null = null

        if (candidate.value.kind === 'arbitrary') {
          value = candidate.value.value
        } else {
          value = theme.resolve(candidate.value.fraction ?? candidate.value.value, [
            '--transition-duration',
          ])

          if (value === null && isPositiveInteger(candidate.value.value)) {
            value = `${candidate.value.value}ms`
          }
        }

        // If the candidate value (like the `sm` in `max-w-sm`) doesn't resolve to
        // an actual value, don't generate any rules.
        if (value === null) return

        return [
          transitionDurationProperty(),
          decl('--tw-duration', value),
          decl('transition-duration', value),
        ]
      })
    }

    suggest('delay', () => [
      {
        values: ['75', '100', '150', '200', '300', '500', '700', '1000'],
        valueThemeKeys: ['--transition-delay'],
      },
    ])

    suggest('duration', () => [
      {
        values: ['75', '100', '150', '200', '300', '500', '700', '1000'],
        valueThemeKeys: ['--transition-duration'],
      },
    ])
  }

  {
    let transitionTimingFunctionProperty = () => {
      return atRoot([property('--tw-ease')])
    }

    staticUtility('ease-initial', [transitionTimingFunctionProperty, ['--tw-ease', 'initial']])
    staticUtility('ease-linear', [
      transitionTimingFunctionProperty,
      ['--tw-ease', 'linear'],
      ['transition-timing-function', 'linear'],
    ])
    functionalUtility('ease', {
      themeKeys: ['--ease'],
      handle: (value) => [
        transitionTimingFunctionProperty(),
        decl('--tw-ease', value),
        decl('transition-timing-function', value),
      ],
    })
  }

  staticUtility('will-change-auto', [['will-change', 'auto']])
  staticUtility('will-change-scroll', [['will-change', 'scroll-position']])
  staticUtility('will-change-contents', [['will-change', 'contents']])
  staticUtility('will-change-transform', [['will-change', 'transform']])
  functionalUtility('will-change', {
    themeKeys: [],
    handle: (value) => [decl('will-change', value)],
  })

  staticUtility('content-none', [
    ['--tw-content', 'none'],
    ['content', 'none'],
  ])
  functionalUtility('content', {
    themeKeys: [],
    handle: (value) => [
      atRoot([property('--tw-content', '""')]),
      decl('--tw-content', value),
      decl('content', 'var(--tw-content)'),
    ],
  })

  {
    let cssContainValue =
      'var(--tw-contain-size,) var(--tw-contain-layout,) var(--tw-contain-paint,) var(--tw-contain-style,)'
    let cssContainProperties = () => {
      return atRoot([
        property('--tw-contain-size'),
        property('--tw-contain-layout'),
        property('--tw-contain-paint'),
        property('--tw-contain-style'),
      ])
    }

    staticUtility('contain-none', [['contain', 'none']])
    staticUtility('contain-content', [['contain', 'content']])
    staticUtility('contain-strict', [['contain', 'strict']])

    staticUtility('contain-size', [
      cssContainProperties,
      ['--tw-contain-size', 'size'],
      ['contain', cssContainValue],
    ])

    staticUtility('contain-inline-size', [
      cssContainProperties,
      ['--tw-contain-size', 'inline-size'],
      ['contain', cssContainValue],
    ])

    staticUtility('contain-layout', [
      cssContainProperties,
      ['--tw-contain-layout', 'layout'],
      ['contain', cssContainValue],
    ])

    staticUtility('contain-paint', [
      cssContainProperties,
      ['--tw-contain-paint', 'paint'],
      ['contain', cssContainValue],
    ])

    staticUtility('contain-style', [
      cssContainProperties,
      ['--tw-contain-style', 'style'],
      ['contain', cssContainValue],
    ])

    functionalUtility('contain', {
      themeKeys: [],
      handle: (value) => [decl('contain', value)],
    })
  }

  staticUtility('forced-color-adjust-none', [['forced-color-adjust', 'none']])
  staticUtility('forced-color-adjust-auto', [['forced-color-adjust', 'auto']])

  staticUtility('leading-none', [
    () => atRoot([property('--tw-leading')]),
    ['--tw-leading', '1'],
    ['line-height', '1'],
  ])
  spacingUtility('leading', ['--leading', '--spacing'], (value) => [
    atRoot([property('--tw-leading')]),
    decl('--tw-leading', value),
    decl('line-height', value),
  ])

  functionalUtility('tracking', {
    supportsNegative: true,
    themeKeys: ['--tracking'],
    handle: (value) => [
      atRoot([property('--tw-tracking')]),
      decl('--tw-tracking', value),
      decl('letter-spacing', value),
    ],
  })

  staticUtility('antialiased', [
    ['-webkit-font-smoothing', 'antialiased'],
    ['-moz-osx-font-smoothing', 'grayscale'],
  ])

  staticUtility('subpixel-antialiased', [
    ['-webkit-font-smoothing', 'auto'],
    ['-moz-osx-font-smoothing', 'auto'],
  ])

  {
    let cssFontVariantNumericValue =
      'var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)'
    let fontVariantNumericProperties = () => {
      return atRoot([
        property('--tw-ordinal'),
        property('--tw-slashed-zero'),
        property('--tw-numeric-figure'),
        property('--tw-numeric-spacing'),
        property('--tw-numeric-fraction'),
      ])
    }

    staticUtility('normal-nums', [['font-variant-numeric', 'normal']])

    staticUtility('ordinal', [
      fontVariantNumericProperties,
      ['--tw-ordinal', 'ordinal'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])

    staticUtility('slashed-zero', [
      fontVariantNumericProperties,
      ['--tw-slashed-zero', 'slashed-zero'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])

    staticUtility('lining-nums', [
      fontVariantNumericProperties,
      ['--tw-numeric-figure', 'lining-nums'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])

    staticUtility('oldstyle-nums', [
      fontVariantNumericProperties,
      ['--tw-numeric-figure', 'oldstyle-nums'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])

    staticUtility('proportional-nums', [
      fontVariantNumericProperties,
      ['--tw-numeric-spacing', 'proportional-nums'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])

    staticUtility('tabular-nums', [
      fontVariantNumericProperties,
      ['--tw-numeric-spacing', 'tabular-nums'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])

    staticUtility('diagonal-fractions', [
      fontVariantNumericProperties,
      ['--tw-numeric-fraction', 'diagonal-fractions'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])

    staticUtility('stacked-fractions', [
      fontVariantNumericProperties,
      ['--tw-numeric-fraction', 'stacked-fractions'],
      ['font-variant-numeric', cssFontVariantNumericValue],
    ])
  }

  {
    let outlineProperties = () => {
      return atRoot([property('--tw-outline-style', 'solid')])
    }

    utilities.static('outline-hidden', () => {
      return [
        decl('--tw-outline-style', 'none'),
        decl('outline-style', 'none'),
        atRule('@media', '(forced-colors: active)', [
          decl('outline', '2px solid transparent'),
          decl('outline-offset', '2px'),
        ]),
      ]
    })

    /**
     * @css `outline-style`
     */
    staticUtility('outline-none', [
      ['--tw-outline-style', 'none'],
      ['outline-style', 'none'],
    ])
    staticUtility('outline-solid', [
      ['--tw-outline-style', 'solid'],
      ['outline-style', 'solid'],
    ])
    staticUtility('outline-dashed', [
      ['--tw-outline-style', 'dashed'],
      ['outline-style', 'dashed'],
    ])
    staticUtility('outline-dotted', [
      ['--tw-outline-style', 'dotted'],
      ['outline-style', 'dotted'],
    ])
    staticUtility('outline-double', [
      ['--tw-outline-style', 'double'],
      ['outline-style', 'double'],
    ])

    utilities.functional('outline', (candidate) => {
      if (candidate.value === null) {
        if (candidate.modifier) return
        let value = theme.get(['--default-outline-width']) ?? '1px'
        return [
          outlineProperties(),
          decl('outline-style', 'var(--tw-outline-style)'),
          decl('outline-width', value),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type =
          candidate.value.dataType ??
          inferDataType(value, ['color', 'length', 'number', 'percentage'])

        switch (type) {
          case 'length':
          case 'number':
          case 'percentage': {
            if (candidate.modifier) return
            return [
              outlineProperties(),
              decl('outline-style', 'var(--tw-outline-style)'),
              decl('outline-width', value),
            ]
          }
          default: {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return [decl('outline-color', value)]
          }
        }
      }

      // `outline-color` property
      {
        let value = resolveThemeColor(candidate, theme, ['--outline-color', '--color'])
        if (value) {
          return [decl('outline-color', value)]
        }
      }

      // `outline-width` property
      {
        if (candidate.modifier) return
        let value = theme.resolve(candidate.value.value, ['--outline-width'])
        if (value) {
          return [
            outlineProperties(),
            decl('outline-style', 'var(--tw-outline-style)'),
            decl('outline-width', value),
          ]
        } else if (isPositiveInteger(candidate.value.value)) {
          return [
            outlineProperties(),
            decl('outline-style', 'var(--tw-outline-style)'),
            decl('outline-width', `${candidate.value.value}px`),
          ]
        }
      }
    })

    suggest('outline', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--outline-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
        hasDefaultValue: true,
      },
      {
        values: ['0', '1', '2', '4', '8'],
        valueThemeKeys: ['--outline-width'],
      },
    ])

    functionalUtility('outline-offset', {
      supportsNegative: true,
      themeKeys: ['--outline-offset'],
      handleBareValue: ({ value }) => {
        if (!isPositiveInteger(value)) return null
        return `${value}px`
      },
      handle: (value) => [decl('outline-offset', value)],
    })

    suggest('outline-offset', () => [
      {
        supportsNegative: true,
        values: ['0', '1', '2', '4', '8'],
        valueThemeKeys: ['--outline-offset'],
      },
    ])
  }

  functionalUtility('opacity', {
    themeKeys: ['--opacity'],
    handleBareValue: ({ value }) => {
      if (!isValidOpacityValue(value)) return null
      return `${value}%`
    },
    handle: (value) => [decl('opacity', value)],
  })

  suggest('opacity', () => [
    {
      values: Array.from({ length: 21 }, (_, i) => `${i * 5}`),
      valueThemeKeys: ['--opacity'],
    },
  ])

  staticUtility('underline-offset-auto', [['text-underline-offset', 'auto']])
  functionalUtility('underline-offset', {
    supportsNegative: true,
    themeKeys: ['--text-underline-offset'],
    handleBareValue: ({ value }) => {
      if (!isPositiveInteger(value)) return null
      return `${value}px`
    },
    handle: (value) => [decl('text-underline-offset', value)],
  })

  suggest('underline-offset', () => [
    {
      supportsNegative: true,
      values: ['0', '1', '2', '4', '8'],
      valueThemeKeys: ['--text-underline-offset'],
    },
  ])

  utilities.functional('text', (candidate) => {
    if (!candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type =
        candidate.value.dataType ??
        inferDataType(value, ['color', 'length', 'percentage', 'absolute-size', 'relative-size'])

      switch (type) {
        case 'size':
        case 'length':
        case 'percentage':
        case 'absolute-size':
        case 'relative-size': {
          if (candidate.modifier) {
            let modifier =
              candidate.modifier.kind === 'arbitrary'
                ? candidate.modifier.value
                : theme.resolve(candidate.modifier.value, ['--leading'])

            if (!modifier && isValidSpacingMultiplier(candidate.modifier.value)) {
              let multiplier = theme.resolve(null, ['--spacing'])
              if (!multiplier) return null
              modifier = `calc(${multiplier} * ${candidate.modifier.value})`
            }

            // Shorthand for `leading-none`
            if (!modifier && candidate.modifier.value === 'none') {
              modifier = '1'
            }

            if (modifier) {
              return [decl('font-size', value), decl('line-height', modifier)]
            }

            return null
          }

          return [decl('font-size', value)]
        }
        default: {
          value = asColor(value, candidate.modifier, theme)
          if (value === null) return

          return [decl('color', value)]
        }
      }
    }

    // `color` property
    {
      let value = resolveThemeColor(candidate, theme, ['--text-color', '--color'])
      if (value) {
        return [decl('color', value)]
      }
    }

    // `font-size` property
    {
      let value = theme.resolveWith(
        candidate.value.value,
        ['--text'],
        ['--line-height', '--letter-spacing', '--font-weight'],
      )
      if (value) {
        let [fontSize, options = {}] = Array.isArray(value) ? value : [value]

        if (candidate.modifier) {
          let modifier =
            candidate.modifier.kind === 'arbitrary'
              ? candidate.modifier.value
              : theme.resolve(candidate.modifier.value, ['--leading'])

          if (!modifier && isValidSpacingMultiplier(candidate.modifier.value)) {
            let multiplier = theme.resolve(null, ['--spacing'])
            if (!multiplier) return null
            modifier = `calc(${multiplier} * ${candidate.modifier.value})`
          }

          // Shorthand for `leading-none`
          if (!modifier && candidate.modifier.value === 'none') {
            modifier = '1'
          }

          if (!modifier) {
            return null
          }

          let declarations = [decl('font-size', fontSize)]
          modifier && declarations.push(decl('line-height', modifier))
          return declarations
        }

        if (typeof options === 'string') {
          return [decl('font-size', fontSize), decl('line-height', options)]
        }

        return [
          decl('font-size', fontSize),
          decl(
            'line-height',
            options['--line-height'] ? `var(--tw-leading, ${options['--line-height']})` : undefined,
          ),
          decl(
            'letter-spacing',
            options['--letter-spacing']
              ? `var(--tw-tracking, ${options['--letter-spacing']})`
              : undefined,
          ),
          decl(
            'font-weight',
            options['--font-weight']
              ? `var(--tw-font-weight, ${options['--font-weight']})`
              : undefined,
          ),
        ]
      }
    }
  })

  suggest('text', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--text-color', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
    },
    {
      values: [],
      valueThemeKeys: ['--text'],
      modifiers: [],
      modifierThemeKeys: ['--leading'],
    },
  ])

  let textShadowProperties = () => {
    return atRoot([
      property('--tw-text-shadow-color'),
      property('--tw-text-shadow-alpha', '100%', '<percentage>'),
    ])
  }

  staticUtility('text-shadow-initial', [
    textShadowProperties,
    ['--tw-text-shadow-color', 'initial'],
  ])

  utilities.functional('text-shadow', (candidate) => {
    let alpha: string | undefined

    if (candidate.modifier) {
      if (candidate.modifier.kind === 'arbitrary') {
        alpha = candidate.modifier.value
      } else {
        if (isPositiveInteger(candidate.modifier.value)) {
          alpha = `${candidate.modifier.value}%`
        }
      }
    }

    if (!candidate.value) {
      let value = theme.get(['--text-shadow'])
      if (value === null) return

      return [
        textShadowProperties(),
        decl('--tw-text-shadow-alpha', alpha),
        ...alphaReplacedShadowProperties(
          'text-shadow',
          value,
          alpha,
          (color) => `var(--tw-text-shadow-color, ${color})`,
        ),
      ]
    }

    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type = candidate.value.dataType ?? inferDataType(value, ['color'])

      switch (type) {
        case 'color': {
          value = asColor(value, candidate.modifier, theme)
          if (value === null) return
          return [
            textShadowProperties(),
            decl('--tw-text-shadow-color', withAlpha(value, 'var(--tw-text-shadow-alpha)')),
          ]
        }
        default: {
          return [
            textShadowProperties(),
            decl('--tw-text-shadow-alpha', alpha),
            ...alphaReplacedShadowProperties(
              'text-shadow',
              value,
              alpha,
              (color) => `var(--tw-text-shadow-color, ${color})`,
            ),
          ]
        }
      }
    }

    switch (candidate.value.value) {
      case 'none':
        if (candidate.modifier) return
        return [textShadowProperties(), decl('text-shadow', 'none')]

      case 'inherit':
        if (candidate.modifier) return
        return [textShadowProperties(), decl('--tw-text-shadow-color', 'inherit')]
    }

    // Shadow size
    {
      let value = theme.get([`--text-shadow-${candidate.value.value}`])
      if (value) {
        return [
          textShadowProperties(),
          decl('--tw-text-shadow-alpha', alpha),
          ...alphaReplacedShadowProperties(
            'text-shadow',
            value,
            alpha,
            (color) => `var(--tw-text-shadow-color, ${color})`,
          ),
        ]
      }
    }

    // Shadow color
    {
      let value = resolveThemeColor(candidate, theme, ['--text-shadow-color', '--color'])
      if (value) {
        return [
          textShadowProperties(),
          decl('--tw-text-shadow-color', withAlpha(value, 'var(--tw-text-shadow-alpha)')),
        ]
      }
    }
  })

  suggest('text-shadow', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--text-shadow-color', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
    },
    {
      values: ['none'],
    },
    {
      valueThemeKeys: ['--text-shadow'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      hasDefaultValue: true,
    },
  ])

  {
    let cssBoxShadowValue = [
      'var(--tw-inset-shadow)',
      'var(--tw-inset-ring-shadow)',
      'var(--tw-ring-offset-shadow)',
      'var(--tw-ring-shadow)',
      'var(--tw-shadow)',
    ].join(', ')
    let nullShadow = '0 0 #0000'

    let boxShadowProperties = () => {
      return atRoot([
        property('--tw-shadow', nullShadow),
        property('--tw-shadow-color'),
        property('--tw-shadow-alpha', '100%', '<percentage>'),
        property('--tw-inset-shadow', nullShadow),
        property('--tw-inset-shadow-color'),
        property('--tw-inset-shadow-alpha', '100%', '<percentage>'),
        property('--tw-ring-color'),
        property('--tw-ring-shadow', nullShadow),
        property('--tw-inset-ring-color'),
        property('--tw-inset-ring-shadow', nullShadow),

        // Legacy
        property('--tw-ring-inset'),
        property('--tw-ring-offset-width', '0px', '<length>'),
        property('--tw-ring-offset-color', '#fff'),
        property('--tw-ring-offset-shadow', nullShadow),
      ])
    }

    staticUtility('shadow-initial', [boxShadowProperties, ['--tw-shadow-color', 'initial']])

    utilities.functional('shadow', (candidate) => {
      let alpha: string | undefined

      if (candidate.modifier) {
        if (candidate.modifier.kind === 'arbitrary') {
          alpha = candidate.modifier.value
        } else {
          if (isPositiveInteger(candidate.modifier.value)) {
            alpha = `${candidate.modifier.value}%`
          }
        }
      }

      if (!candidate.value) {
        let value = theme.get(['--shadow'])
        if (value === null) return

        return [
          boxShadowProperties(),
          decl('--tw-shadow-alpha', alpha),
          ...alphaReplacedShadowProperties(
            '--tw-shadow',
            value,
            alpha,
            (color) => `var(--tw-shadow-color, ${color})`,
          ),
          decl('box-shadow', cssBoxShadowValue),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['color'])

        switch (type) {
          case 'color': {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return [
              boxShadowProperties(),
              decl('--tw-shadow-color', withAlpha(value, 'var(--tw-shadow-alpha)')),
            ]
          }
          default: {
            return [
              boxShadowProperties(),
              decl('--tw-shadow-alpha', alpha),
              ...alphaReplacedShadowProperties(
                '--tw-shadow',
                value,
                alpha,
                (color) => `var(--tw-shadow-color, ${color})`,
              ),
              decl('box-shadow', cssBoxShadowValue),
            ]
          }
        }
      }

      switch (candidate.value.value) {
        case 'none':
          if (candidate.modifier) return
          return [
            boxShadowProperties(),
            decl('--tw-shadow', nullShadow),
            decl('box-shadow', cssBoxShadowValue),
          ]

        case 'inherit':
          if (candidate.modifier) return
          return [boxShadowProperties(), decl('--tw-shadow-color', 'inherit')]
      }

      // Shadow size
      {
        let value = theme.get([`--shadow-${candidate.value.value}`])
        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-shadow-alpha', alpha),
            ...alphaReplacedShadowProperties(
              '--tw-shadow',
              value,
              alpha,
              (color) => `var(--tw-shadow-color, ${color})`,
            ),
            decl('box-shadow', cssBoxShadowValue),
          ]
        }
      }

      // Shadow color
      {
        let value = resolveThemeColor(candidate, theme, ['--box-shadow-color', '--color'])
        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-shadow-color', withAlpha(value, 'var(--tw-shadow-alpha)')),
          ]
        }
      }
    })

    suggest('shadow', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--box-shadow-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
      {
        values: ['none'],
      },
      {
        valueThemeKeys: ['--shadow'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
        hasDefaultValue: true,
      },
    ])

    staticUtility('inset-shadow-initial', [
      boxShadowProperties,
      ['--tw-inset-shadow-color', 'initial'],
    ])

    utilities.functional('inset-shadow', (candidate) => {
      let alpha: string | undefined

      if (candidate.modifier) {
        if (candidate.modifier.kind === 'arbitrary') {
          alpha = candidate.modifier.value
        } else {
          if (isPositiveInteger(candidate.modifier.value)) {
            alpha = `${candidate.modifier.value}%`
          }
        }
      }

      if (!candidate.value) {
        let value = theme.get(['--inset-shadow'])
        if (value === null) return

        return [
          boxShadowProperties(),
          decl('--tw-inset-shadow-alpha', alpha),
          ...alphaReplacedShadowProperties(
            '--tw-inset-shadow',
            value,
            alpha,
            (color) => `var(--tw-inset-shadow-color, ${color})`,
          ),
          decl('box-shadow', cssBoxShadowValue),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['color'])

        switch (type) {
          case 'color': {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return [
              boxShadowProperties(),
              decl('--tw-inset-shadow-color', withAlpha(value, 'var(--tw-inset-shadow-alpha)')),
            ]
          }
          default: {
            return [
              boxShadowProperties(),
              decl('--tw-inset-shadow-alpha', alpha),
              ...alphaReplacedShadowProperties(
                '--tw-inset-shadow',
                value,
                alpha,
                (color) => `var(--tw-inset-shadow-color, ${color})`,
                'inset ',
              ),
              decl('box-shadow', cssBoxShadowValue),
            ]
          }
        }
      }

      switch (candidate.value.value) {
        case 'none':
          if (candidate.modifier) return
          return [
            boxShadowProperties(),
            decl('--tw-inset-shadow', nullShadow),
            decl('box-shadow', cssBoxShadowValue),
          ]

        case 'inherit':
          if (candidate.modifier) return
          return [boxShadowProperties(), decl('--tw-inset-shadow-color', 'inherit')]
      }

      // Shadow size
      {
        let value = theme.get([`--inset-shadow-${candidate.value.value}`])

        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-inset-shadow-alpha', alpha),
            ...alphaReplacedShadowProperties(
              '--tw-inset-shadow',
              value,
              alpha,
              (color) => `var(--tw-inset-shadow-color, ${color})`,
            ),
            decl('box-shadow', cssBoxShadowValue),
          ]
        }
      }

      // Shadow color
      {
        let value = resolveThemeColor(candidate, theme, ['--box-shadow-color', '--color'])
        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-inset-shadow-color', withAlpha(value, 'var(--tw-inset-shadow-alpha)')),
          ]
        }
      }
    })

    suggest('inset-shadow', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--box-shadow-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
      {
        values: ['none'],
      },
      {
        valueThemeKeys: ['--inset-shadow'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
        hasDefaultValue: true,
      },
    ])

    staticUtility('ring-inset', [boxShadowProperties, ['--tw-ring-inset', 'inset']])

    let defaultRingColor = theme.get(['--default-ring-color']) ?? 'currentcolor'
    function ringShadowValue(value: string) {
      return `var(--tw-ring-inset,) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color, ${defaultRingColor})`
    }
    utilities.functional('ring', (candidate) => {
      if (!candidate.value) {
        if (candidate.modifier) return
        let value = theme.get(['--default-ring-width']) ?? '1px'
        return [
          boxShadowProperties(),
          decl('--tw-ring-shadow', ringShadowValue(value)),
          decl('box-shadow', cssBoxShadowValue),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['color', 'length'])

        switch (type) {
          case 'length': {
            if (candidate.modifier) return
            return [
              boxShadowProperties(),
              decl('--tw-ring-shadow', ringShadowValue(value)),
              decl('box-shadow', cssBoxShadowValue),
            ]
          }
          default: {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return [decl('--tw-ring-color', value)]
          }
        }
      }

      // Ring color
      {
        let value = resolveThemeColor(candidate, theme, ['--ring-color', '--color'])
        if (value) {
          return [decl('--tw-ring-color', value)]
        }
      }

      // Ring width
      {
        if (candidate.modifier) return
        let value = theme.resolve(candidate.value.value, ['--ring-width'])
        if (value === null && isPositiveInteger(candidate.value.value)) {
          value = `${candidate.value.value}px`
        }
        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-ring-shadow', ringShadowValue(value)),
            decl('box-shadow', cssBoxShadowValue),
          ]
        }
      }
    })

    suggest('ring', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--ring-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
      {
        values: ['0', '1', '2', '4', '8'],
        valueThemeKeys: ['--ring-width'],
        hasDefaultValue: true,
      },
    ])

    function insetRingShadowValue(value: string) {
      return `inset 0 0 0 ${value} var(--tw-inset-ring-color, currentcolor)`
    }
    utilities.functional('inset-ring', (candidate) => {
      if (!candidate.value) {
        if (candidate.modifier) return
        return [
          boxShadowProperties(),
          decl('--tw-inset-ring-shadow', insetRingShadowValue('1px')),
          decl('box-shadow', cssBoxShadowValue),
        ]
      }

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['color', 'length'])

        switch (type) {
          case 'length': {
            if (candidate.modifier) return
            return [
              boxShadowProperties(),
              decl('--tw-inset-ring-shadow', insetRingShadowValue(value)),
              decl('box-shadow', cssBoxShadowValue),
            ]
          }
          default: {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return [decl('--tw-inset-ring-color', value)]
          }
        }
      }

      // Ring color
      {
        let value = resolveThemeColor(candidate, theme, ['--ring-color', '--color'])
        if (value) {
          return [decl('--tw-inset-ring-color', value)]
        }
      }

      // Ring width
      {
        if (candidate.modifier) return
        let value = theme.resolve(candidate.value.value, ['--ring-width'])
        if (value === null && isPositiveInteger(candidate.value.value)) {
          value = `${candidate.value.value}px`
        }
        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-inset-ring-shadow', insetRingShadowValue(value)),
            decl('box-shadow', cssBoxShadowValue),
          ]
        }
      }
    })

    suggest('inset-ring', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--ring-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      },
      {
        values: ['0', '1', '2', '4', '8'],
        valueThemeKeys: ['--ring-width'],
        hasDefaultValue: true,
      },
    ])

    let ringOffsetShadowValue =
      'var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)'
    utilities.functional('ring-offset', (candidate) => {
      if (!candidate.value) return

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['color', 'length'])

        switch (type) {
          case 'length': {
            if (candidate.modifier) return
            return [
              decl('--tw-ring-offset-width', value),
              decl('--tw-ring-offset-shadow', ringOffsetShadowValue),
            ]
          }
          default: {
            value = asColor(value, candidate.modifier, theme)
            if (value === null) return

            return [decl('--tw-ring-offset-color', value)]
          }
        }
      }

      // `--tw-ring-offset-width` property
      {
        let value = theme.resolve(candidate.value.value, ['--ring-offset-width'])
        if (value) {
          if (candidate.modifier) return
          return [
            decl('--tw-ring-offset-width', value),
            decl('--tw-ring-offset-shadow', ringOffsetShadowValue),
          ]
        } else if (isPositiveInteger(candidate.value.value)) {
          if (candidate.modifier) return
          return [
            decl('--tw-ring-offset-width', `${candidate.value.value}px`),
            decl('--tw-ring-offset-shadow', ringOffsetShadowValue),
          ]
        }
      }

      // `--tw-ring-offset-color` property
      {
        let value = resolveThemeColor(candidate, theme, ['--ring-offset-color', '--color'])
        if (value) {
          return [decl('--tw-ring-offset-color', value)]
        }
      }
    })
  }

  suggest('ring-offset', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--ring-offset-color', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
    },
    {
      values: ['0', '1', '2', '4', '8'],
      valueThemeKeys: ['--ring-offset-width'],
    },
  ])

  utilities.functional('@container', (candidate) => {
    let value: string | null = null
    if (candidate.value === null) {
      value = 'inline-size'
    } else if (candidate.value.kind === 'arbitrary') {
      value = candidate.value.value
    } else if (candidate.value.kind === 'named' && candidate.value.value === 'normal') {
      value = 'normal'
    }

    if (value === null) return

    if (candidate.modifier) {
      return [decl('container-type', value), decl('container-name', candidate.modifier.value)]
    }

    return [decl('container-type', value)]
  })

  suggest('@container', () => [
    {
      values: ['normal'],
      valueThemeKeys: [],
      hasDefaultValue: true,
    },
  ])

  return utilities
}

// Only allowed bare value data types, to prevent creating new syntax that we
// typically don't support right now. E.g.: `--value(color)` would allow you to
// use `text-#0088cc` as a valid utility, which is not what we want.
export const BARE_VALUE_DATA_TYPES = [
  'number', // 2.5
  'integer', // 8
  'ratio', // 2/3
  'percentage', // 25%
]

export function createCssUtility(node: AtRule) {
  let name = node.params

  // Functional utilities. E.g.: `tab-size-*`
  if (IS_VALID_FUNCTIONAL_UTILITY_NAME.test(name)) {
    // API:
    //
    // - `--value('literal')`         resolves a literal named value
    // - `--value(number)`            resolves a bare value of type number
    // - `--value([number])`          resolves an arbitrary value of type number
    // - `--value(--color)`           resolves a theme value in the `color` namespace
    // - `--value(number, [number])`  resolves a bare value of type number or an
    //                                arbitrary value of type number in order.
    //
    // Rules:
    //
    // - If `--value(…)` does not resolve to a valid value, the declaration is
    //   removed.
    // - If a `--value(ratio)` resolves, the `--modifier(…)` cannot be used.
    // - If a candidate looks like `foo-2/3`, then the `--value(ratio)` should
    //   be used OR the `--value(…)` and `--modifier(…)` must be used. But not
    //   both.
    // - All parts of the candidate must resolve, otherwise it's not a valid
    //   utility. E.g.:`
    //   ```
    //   @utility foo-* {
    //     test: --value(number)
    //   }
    //   ```
    //   If you then use `foo-1/2`, this is invalid, because the modifier is not used.

    return (designSystem: DesignSystem) => {
      let storage = {
        '--value': {
          usedSpacingInteger: false,
          usedSpacingNumber: false,
          themeKeys: new Set<`--${string}`>(),
          literals: new Set<string>(),
        },
        '--modifier': {
          usedSpacingInteger: false,
          usedSpacingNumber: false,
          themeKeys: new Set<`--${string}`>(),
          literals: new Set<string>(),
        },
      }

      // Pre-process the AST to make it easier to work with.
      //
      // - Normalize theme values used in `--value(…)` and `--modifier(…)`
      //   functions.
      // - Track information for suggestions
      walk(node.nodes, (child) => {
        if (child.kind !== 'declaration') return
        if (!child.value) return
        if (!child.value.includes('--value(') && !child.value.includes('--modifier(')) return

        let declarationValueAst = ValueParser.parse(child.value)

        // Required manipulations:
        //
        // - `--value(--spacing)`                 -> `--value(--spacing-*)`
        // - `--value(--spacing- *)`              -> `--value(--spacing-*)`
        // - `--value(--text- * --line-height)`   -> `--value(--text-*--line-height)`
        // - `--value(--text --line-height)`      -> `--value(--text-*--line-height)`
        // - `--value(--text-\\* --line-height)`  -> `--value(--text-*--line-height)`
        // - `--value([ *])`                      -> `--value([*])`
        //
        // Once Prettier / Biome handle these better (e.g.: not crashing without
        // `\\*` or not inserting whitespace) then most of these can go away.
        ValueParser.walk(declarationValueAst, (fn) => {
          if (fn.kind !== 'function') return

          // Track usage of `--spacing(…)`
          if (
            fn.value === '--spacing' &&
            // Quick bail check if we already know that `--value` and `--modifier` are
            // using the full `--spacing` theme scale.
            !(storage['--modifier'].usedSpacingNumber && storage['--value'].usedSpacingNumber)
          ) {
            ValueParser.walk(fn.nodes, (node) => {
              if (node.kind !== 'function') return
              if (node.value !== '--value' && node.value !== '--modifier') return
              const key = node.value

              for (let arg of node.nodes) {
                if (arg.kind !== 'word') continue

                if (arg.value === 'integer') {
                  storage[key].usedSpacingInteger ||= true
                } else if (arg.value === 'number') {
                  storage[key].usedSpacingNumber ||= true

                  // Once both `--value` and `--modifier` are using the full
                  // `number` spacing scale, then there's no need to continue
                  if (
                    storage['--modifier'].usedSpacingNumber &&
                    storage['--value'].usedSpacingNumber
                  ) {
                    return ValueParser.ValueWalkAction.Stop
                  }
                }
              }
            })
            return ValueParser.ValueWalkAction.Continue
          }

          if (fn.value !== '--value' && fn.value !== '--modifier') return

          let args = segment(ValueParser.toCss(fn.nodes), ',')
          for (let [idx, arg] of args.entries()) {
            // Transform escaped `\\*` -> `*`
            arg = arg.replace(/\\\*/g, '*')

            // Ensure `--value(--foo --bar)` becomes `--value(--foo-*--bar)`
            arg = arg.replace(/--(.*?)\s--(.*?)/g, '--$1-*--$2')

            // Remove whitespace, e.g.: `--value([ *])` -> `--value([*])`
            arg = arg.replace(/\s+/g, '')

            // Ensure multiple `-*` becomes a single `-*`
            arg = arg.replace(/(-\*){2,}/g, '-*')

            // Ensure trailing `-*` exists if `-*` isn't present yet
            if (arg[0] === '-' && arg[1] === '-' && !arg.includes('-*')) {
              arg += '-*'
            }

            args[idx] = arg
          }
          fn.nodes = ValueParser.parse(args.join(','))

          for (let node of fn.nodes) {
            // Track literal values
            if (
              node.kind === 'word' &&
              (node.value[0] === '"' || node.value[0] === "'") &&
              node.value[0] === node.value[node.value.length - 1]
            ) {
              let value = node.value.slice(1, -1)
              storage[fn.value].literals.add(value)
            }

            // Track theme keys
            else if (node.kind === 'word' && node.value[0] === '-' && node.value[1] === '-') {
              let value = node.value.replace(/-\*.*$/g, '') as `--${string}`
              storage[fn.value].themeKeys.add(value)
            }

            // Validate bare value data types
            else if (
              node.kind === 'word' &&
              !(node.value[0] === '[' && node.value[node.value.length - 1] === ']') && // Ignore arbitrary values
              !BARE_VALUE_DATA_TYPES.includes(node.value)
            ) {
              console.warn(
                `Unsupported bare value data type: "${node.value}".\nOnly valid data types are: ${BARE_VALUE_DATA_TYPES.map((x) => `"${x}"`).join(', ')}.\n`,
              )
              // TODO: Once we properly track the location of the node, we can
              //       clean this up in a better way.
              let dataType = node.value
              let copy = structuredClone(fn)
              let sentinelValue = '¶'
              ValueParser.walk(copy.nodes, (node, { replaceWith }) => {
                if (node.kind === 'word' && node.value === dataType) {
                  replaceWith({ kind: 'word', value: sentinelValue })
                }
              })
              let underline = '^'.repeat(ValueParser.toCss([node]).length)
              let offset = ValueParser.toCss([copy]).indexOf(sentinelValue)
              let output = [
                '```css',
                ValueParser.toCss([fn]),
                ' '.repeat(offset) + underline,
                '```',
              ].join('\n')
              console.warn(output)
            }
          }
        })

        child.value = ValueParser.toCss(declarationValueAst)
      })

      designSystem.utilities.functional(name.slice(0, -2), (candidate) => {
        let atRule = structuredClone(node)

        let value = candidate.value
        let modifier = candidate.modifier

        // A value is required for functional utilities, if you want to accept
        // just `tab-size`, you'd have to use a static utility.
        if (value === null) return

        // Whether `--value(…)` was used
        let usedValueFn = false

        // Whether any of the declarations successfully resolved a `--value(…)`.
        // E.g:
        // ```css
        // @utility tab-size-* {
        //   tab-size: --value(integer);
        //   tab-size: --value(--tab-size);
        //   tab-size: --value([integer]);
        // }
        // ```
        // Any of these `tab-size` declarations have to resolve to a valid in
        // order to make the utility valid.
        let resolvedValueFn = false

        // Whether `--modifier(…)` was used
        let usedModifierFn = false

        // Whether any of the declarations successfully resolved a `--modifier(…)`
        let resolvedModifierFn = false

        // A map of all declarations we replaced and their parent rules. We
        // might need to remove some later on. E.g.: remove declarations that
        // used `--value(number)` when `--value(ratio)` was resolved.
        let resolvedDeclarations = new Map<Declaration, AtRule | Rule>()

        // Whether `--value(ratio)` was resolved
        let resolvedRatioValue = false

        walk([atRule], (node, { parent, replaceWith: replaceDeclarationWith }) => {
          if (parent?.kind !== 'rule' && parent?.kind !== 'at-rule') return
          if (node.kind !== 'declaration') return
          if (!node.value) return

          let valueAst = ValueParser.parse(node.value)
          let result =
            ValueParser.walk(valueAst, (valueNode, { replaceWith }) => {
              if (valueNode.kind !== 'function') return

              // Value function, e.g.: `--value(integer)`
              if (valueNode.value === '--value') {
                usedValueFn = true

                let resolved = resolveValueFunction(value, valueNode, designSystem)
                if (resolved) {
                  resolvedValueFn = true
                  if (resolved.ratio) {
                    resolvedRatioValue = true
                  } else {
                    resolvedDeclarations.set(node, parent)
                  }
                  replaceWith(resolved.nodes)
                  return ValueParser.ValueWalkAction.Skip
                }

                // Drop the declaration in case we couldn't resolve the value
                usedValueFn ||= false
                replaceDeclarationWith([])
                return ValueParser.ValueWalkAction.Stop
              }

              // Modifier function, e.g.: `--modifier(integer)`
              else if (valueNode.value === '--modifier') {
                // If there is no modifier present in the candidate, then the
                // declaration can be removed.
                if (modifier === null) {
                  replaceDeclarationWith([])
                  return ValueParser.ValueWalkAction.Stop
                }

                usedModifierFn = true

                let replacement = resolveValueFunction(modifier, valueNode, designSystem)
                if (replacement) {
                  resolvedModifierFn = true
                  replaceWith(replacement.nodes)
                  return ValueParser.ValueWalkAction.Skip
                }

                // Drop the declaration in case we couldn't resolve the value
                usedModifierFn ||= false
                replaceDeclarationWith([])
                return ValueParser.ValueWalkAction.Stop
              }
            }) ?? ValueParser.ValueWalkAction.Continue

          if (result === ValueParser.ValueWalkAction.Continue) {
            node.value = ValueParser.toCss(valueAst)
          }
        })

        // Used `--value(…)` but nothing resolved
        if (usedValueFn && !resolvedValueFn) return null

        // Used `--modifier(…)` but nothing resolved
        if (usedModifierFn && !resolvedModifierFn) return null

        // Resolved `--value(ratio)` and `--modifier(…)`, which is invalid
        if (resolvedRatioValue && resolvedModifierFn) return null

        // When a candidate has a modifier, then the `--modifier(…)` must
        // resolve correctly or the `--value(ratio)` must resolve correctly.
        if (modifier && !resolvedRatioValue && !resolvedModifierFn) return null

        // Resolved `--value(ratio)`, so all other declarations that didn't use
        // `--value(ratio)` should be removed. E.g.: `--value(number)` would
        // otherwise resolve for `foo-1/2`.
        if (resolvedRatioValue) {
          for (let [declaration, parent] of resolvedDeclarations) {
            let idx = parent.nodes.indexOf(declaration)
            if (idx !== -1) parent.nodes.splice(idx, 1)
          }
        }

        return atRule.nodes
      })

      designSystem.utilities.suggest(name.slice(0, -2), () => {
        let values: string[] = []
        let modifiers: string[] = []

        for (let [target, { literals, usedSpacingNumber, usedSpacingInteger, themeKeys }] of [
          [values, storage['--value']],
          [modifiers, storage['--modifier']],
        ] as const) {
          // Suggest literal values. E.g.: `--value('literal')`
          for (let value of literals) {
            target.push(value)
          }

          // Suggest `--spacing(…)` values. E.g.: `--spacing(--value(integer))`
          if (usedSpacingNumber) {
            target.push(...DEFAULT_SPACING_SUGGESTIONS)
          } else if (usedSpacingInteger) {
            for (let value of DEFAULT_SPACING_SUGGESTIONS) {
              if (isPositiveInteger(value)) {
                target.push(value)
              }
            }
          }

          // Suggest theme values. E.g.: `--value(--color-*)`
          for (let value of designSystem.theme.keysInNamespaces(themeKeys)) {
            target.push(value)
          }
        }

        return [{ values, modifiers }] satisfies SuggestionGroup[]
      })
    }
  }

  if (IS_VALID_STATIC_UTILITY_NAME.test(name)) {
    return (designSystem: DesignSystem) => {
      designSystem.utilities.static(name, () => structuredClone(node.nodes))
    }
  }

  return null
}

function resolveValueFunction(
  value: NonNullable<
    | Extract<Candidate, { kind: 'functional' }>['value']
    | Extract<Candidate, { kind: 'functional' }>['modifier']
  >,
  fn: ValueParser.ValueFunctionNode,
  designSystem: DesignSystem,
): { nodes: ValueParser.ValueAstNode[]; ratio?: boolean } | undefined {
  for (let arg of fn.nodes) {
    // Resolve literal value, e.g.: `--modifier('closest-side')`
    if (
      value.kind === 'named' &&
      arg.kind === 'word' &&
      // Should be wreapped in quotes
      (arg.value[0] === "'" || arg.value[0] === '"') &&
      arg.value[arg.value.length - 1] === arg.value[0] &&
      // Values should match
      arg.value.slice(1, -1) === value.value
    ) {
      return { nodes: ValueParser.parse(value.value) }
    }

    // Resolving theme value, e.g.: `--value(--color)`
    else if (
      value.kind === 'named' &&
      arg.kind === 'word' &&
      arg.value[0] === '-' &&
      arg.value[1] === '-'
    ) {
      let themeKey = arg.value as `--${string}`

      // Resolve the theme value, e.g.: `--value(--color)`
      if (themeKey.endsWith('-*')) {
        // Without `-*` postfix
        themeKey = themeKey.slice(0, -2) as `--${string}`

        let resolved = designSystem.theme.resolve(value.value, [themeKey])
        if (resolved) return { nodes: ValueParser.parse(resolved) }
      }

      // Split `--text-*--line-height` into `--text` and `--line-height`
      else {
        let nestedKeys = themeKey.split('-*') as `--${string}`[]
        if (nestedKeys.length <= 1) continue

        // Resolve theme values with nested keys, e.g.: `--value(--text-*--line-height)`
        let themeKeys = [nestedKeys.shift()!]
        let resolved = designSystem.theme.resolveWith(value.value, themeKeys, nestedKeys)
        if (resolved) {
          let [, options = {}] = resolved

          // Resolve the value from the `options`
          {
            let resolved = options[nestedKeys.pop()!]
            if (resolved) return { nodes: ValueParser.parse(resolved) }
          }
        }
      }
    }

    // Bare value, e.g.: `--value(integer)`
    else if (value.kind === 'named' && arg.kind === 'word') {
      // Limit the bare value types, to prevent new syntax that we
      // don't want to support. E.g.: `text-#000` is something we
      // don't want to support, but could be built this way.
      if (!BARE_VALUE_DATA_TYPES.includes(arg.value)) {
        continue
      }

      let resolved = arg.value === 'ratio' && 'fraction' in value ? value.fraction : value.value
      if (!resolved) continue

      let type = inferDataType(resolved, [arg.value as any])
      if (type === null) continue

      // Ratio must be a valid fraction, e.g.: <integer>/<integer>
      if (type === 'ratio') {
        let [lhs, rhs] = segment(resolved, '/')
        if (!isPositiveInteger(lhs) || !isPositiveInteger(rhs)) continue
      }

      // Non-integer numbers should be a valid multiplier,
      // e.g.: `1.5`
      else if (type === 'number' && !isValidSpacingMultiplier(resolved)) {
        continue
      }

      // Percentages must be an integer, e.g.: `50%`
      else if (type === 'percentage' && !isPositiveInteger(resolved.slice(0, -1))) {
        continue
      }

      return { nodes: ValueParser.parse(resolved), ratio: type === 'ratio' }
    }

    // Arbitrary value, e.g.: `--value([integer])`
    else if (
      value.kind === 'arbitrary' &&
      arg.kind === 'word' &&
      arg.value[0] === '[' &&
      arg.value[arg.value.length - 1] === ']'
    ) {
      let dataType = arg.value.slice(1, -1)

      // Allow any data type, e.g.: `--value([*])`
      if (dataType === '*') {
        return { nodes: ValueParser.parse(value.value) }
      }

      // The forced arbitrary value hint must match the expected
      // data type.
      //
      // ```css
      // @utility tab-* {
      //   tab-size: --value([integer]);
      // }
      // ```
      //
      // Given a candidate like `tab-(color:var(--my-value))`,
      // should not match because `color` and `integer` don't
      // match.
      if ('dataType' in value && value.dataType && value.dataType !== dataType) {
        continue
      }

      // Use the provided data type hint
      if ('dataType' in value && value.dataType) {
        return { nodes: ValueParser.parse(value.value) }
      }

      // No data type hint provided, so we have to infer it
      let type = inferDataType(value.value, [dataType as any])
      if (type !== null) {
        return { nodes: ValueParser.parse(value.value) }
      }
    }
  }
}

function alphaReplacedShadowProperties(
  property: string,
  value: string,
  alpha: string | null | undefined,
  varInjector: (color: string) => string,
  prefix: string = '',
): AstNode[] {
  let requiresFallback = false
  let replacedValue = replaceShadowColors(value, (color) => {
    if (alpha == null) {
      return varInjector(color)
    }

    // When the input is currentcolor, we use our existing `color-mix(…)` approach to increase
    // browser support. Note that the fallback of this is handled more generically in
    // post-processing.
    if (color.startsWith('current')) {
      return varInjector(withAlpha(color, alpha))
    }

    // If any dynamic values are needed for the relative color syntax, we need to insert a
    // replacement as lightningcss won't be able to resolve them statically.
    if (color.startsWith('var(') || alpha.startsWith('var(')) {
      requiresFallback = true
    }

    return varInjector(replaceAlpha(color, alpha))
  })

  function applyPrefix(x: string) {
    if (!prefix) return x
    return segment(x, ',')
      .map((value) => prefix + value)
      .join(',')
  }

  if (requiresFallback) {
    return [
      decl(property, applyPrefix(replaceShadowColors(value, varInjector))),
      rule('@supports (color: lab(from red l a b))', [decl(property, applyPrefix(replacedValue))]),
    ]
  } else {
    return [decl(property, applyPrefix(replacedValue))]
  }
}

function alphaReplacedDropShadowProperties(
  property: string,
  value: string,
  alpha: string | null | undefined,
  varInjector: (color: string) => string,
  prefix: string = '',
): AstNode[] {
  let requiresFallback = false

  let replacedValue = segment(value, ',')
    .map((value) =>
      replaceShadowColors(value, (color) => {
        if (alpha == null) {
          return varInjector(color)
        }

        // When the input is currentcolor, we use our existing `color-mix(…)` approach to increase
        // browser support. Note that the fallback of this is handled more generically in
        // post-processing.
        if (color.startsWith('current')) {
          return varInjector(withAlpha(color, alpha))
        }

        // If any dynamic values are needed for the relative color syntax, we need to insert a
        // replacement as lightningcss won't be able to resolve them statically.
        if (color.startsWith('var(') || alpha.startsWith('var(')) {
          requiresFallback = true
        }

        return varInjector(replaceAlpha(color, alpha))
      }),
    )
    .map((value) => `drop-shadow(${value})`)
    .join(' ')

  if (requiresFallback) {
    return [
      decl(
        property,
        prefix +
          segment(value, ',')
            .map((value) => `drop-shadow(${replaceShadowColors(value, varInjector)})`)
            .join(' '),
      ),
      rule('@supports (color: lab(from red l a b))', [decl(property, prefix + replacedValue)]),
    ]
  } else {
    return [decl(property, prefix + replacedValue)]
  }
}
