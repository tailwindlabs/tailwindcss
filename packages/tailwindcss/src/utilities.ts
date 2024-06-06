import { decl, rule, type AstNode, type Rule } from './ast'
import type { Candidate, CandidateModifier, NamedUtilityValue } from './candidate'
import type { ColorThemeKey, Theme, ThemeKey } from './theme'
import { inferDataType } from './utils/infer-data-type'
import { replaceShadowColors } from './utils/replace-shadow-colors'
import { segment } from './utils/segment'

const ARBITRARY_VARIANT = Symbol('ARBITRARY_VARIANT')

type CompileFn<T extends Candidate['kind']> = (
  value: Extract<Candidate, { kind: T }>,
) => AstNode[] | undefined

interface SuggestionGroup {
  supportsNegative?: boolean
  values: (string | null)[]
  modifiers: string[]
}

type SuggestionDefinition =
  | string
  | {
      supportsNegative?: boolean
      values?: string[]
      modifiers?: string[]
      valueThemeKeys?: ThemeKey[]
      modifierThemeKeys?: ThemeKey[]
      hasDefaultValue?: boolean
    }

export class Utilities {
  private utilities = new Map<
    string | symbol,
    {
      kind: Candidate['kind']
      compileFn: CompileFn<any>
    }
  >()

  private completions = new Map<string, () => SuggestionGroup[]>()

  static(name: string, compileFn: CompileFn<'static'>) {
    this.set(name, { kind: 'static', compileFn: compileFn })
  }

  functional(name: string, compileFn: CompileFn<'functional'>) {
    this.set(name, { kind: 'functional', compileFn: compileFn })
  }

  arbitrary(compileFn: CompileFn<'arbitrary'>) {
    this.set(ARBITRARY_VARIANT, { kind: 'arbitrary', compileFn: compileFn })
  }

  has(name: string) {
    return this.utilities.has(name)
  }

  get(name: string | symbol) {
    return this.utilities.get(name)
  }

  kind(name: string) {
    return this.utilities.get(name)!.kind
  }

  getCompletions(name: string): SuggestionGroup[] {
    return this.completions.get(name)?.() ?? []
  }

  suggest(name: string, groups: () => SuggestionGroup[]) {
    // TODO: We are calling this multiple times on purpose but ideally only ever
    // once per utility root.
    this.completions.set(name, groups)
  }

  keys() {
    return this.utilities.keys()
  }

  entries() {
    return this.utilities.entries()
  }

  getArbitrary() {
    return this.get(ARBITRARY_VARIANT)!.compileFn
  }

  private set<T extends Candidate['kind']>(
    name: string | symbol,
    { kind, compileFn }: { kind: T; compileFn: CompileFn<T> },
  ) {
    // In test mode, throw an error if we accidentally override another utility
    // by mistake when implementing a new utility that shares the same root
    // without realizing the definitions need to be merged.
    if (process.env.NODE_ENV === 'test') {
      if (this.utilities.has(name)) {
        throw new Error(`Duplicate utility prefix [${name.toString()}]`)
      }
    }

    this.utilities.set(name, {
      kind,
      compileFn: compileFn,
    })
  }
}

function atRoot(rules: Rule[]) {
  return rule('@at-root', rules)
}

function property(ident: string, initialValue?: string, syntax?: string) {
  return rule(`@property ${ident}`, [
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
function withAlpha(value: string, alpha: string): string {
  if (alpha === null) return value

  // Convert numeric values (like `0.5`) to percentages (like `50%`) so they
  // work properly with `color-mix`. Assume anything that isn't a number is
  // safe to pass through as-is, like `var(--my-opacity)`.
  let alphaAsNumber = Number(alpha)
  if (!Number.isNaN(alphaAsNumber)) {
    alpha = `${alphaAsNumber * 100}%`
  }

  return `color-mix(in srgb, ${value} ${alpha}, transparent)`
}

/**
 * Resolve a color value + optional opacity modifier to a final color.
 */
function asColor(value: string, modifier: CandidateModifier | null, theme: Theme): string | null {
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

  if (Number.isNaN(Number(modifier.value))) {
    return null
  }

  // The modifier is a bare value like `50`, so convert that to `50%`.
  return withAlpha(value, `${modifier.value}%`)
}

/**
 * Negate a numeric value — literals get simplified by Lightning CSS.
 */
function withNegative(
  value: string,
  candidate: Extract<Candidate, { kind: 'static' | 'functional' }>,
) {
  return candidate.negative ? `calc(${value} * -1)` : value
}

/**
 * Finds a color in the theme under one of the given theme keys that matches
 * `candidateValue`.
 *
 * The values `inherit`, `transparent` and `current` are special-cased as they
 * are universal and don't need to be resolved from the theme.
 */
function resolveThemeColor<T extends ColorThemeKey>(
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
      value = 'currentColor'
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

  utilities.arbitrary((candidate) => {
    let value: string | null = candidate.value

    // Assumption: If an arbitrary property has a modifier, then we assume it
    // is an opacity modifier.
    if (candidate.modifier) {
      value = asColor(value, candidate.modifier, theme)
    }

    if (value === null) return

    return [decl(candidate.property, value)]
  })

  /**
   * Register list of suggestions for a class
   */
  function suggest(classRoot: string, defns: () => SuggestionDefinition[]) {
    function* resolve(themeKeys: ThemeKey[]) {
      for (let value of theme.keysInNamespaces(themeKeys)) {
        yield value.replaceAll('_', '.')
      }
    }

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
    utilities.static(className, (candidate) => {
      if (candidate.negative) return

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
    handle: (value: string) => AstNode[] | undefined
  }

  /**
   * Register a functional utility class like `max-w-*` that maps to tokens in the
   * user's theme.
   */
  function functionalUtility(classRoot: string, desc: UtilityDescription) {
    utilities.functional(classRoot, (candidate) => {
      // If the class candidate has a negative prefix (like `-mx-2`) but this
      // utility doesn't support negative values (like the `width` utility),
      // don't generate any rules.
      if (candidate.negative && !desc.supportsNegative) return

      let value: string | null = null

      if (!candidate.value) {
        // If the candidate has no value segment (like `shadow`), use the
        // `defaultValue` or the `DEFAULT` value in the theme. No utility will
        // ever support both of these — `defaultValue` is for things like
        // `grayscale` whereas the `DEFAULT` in theme is for things like
        // `shadow` or `blur`.
        value = desc.defaultValue ?? theme.get(desc.themeKeys ?? [])
      } else if (candidate.value.kind === 'arbitrary') {
        value = candidate.value.value
      } else {
        value = theme.resolve(
          candidate.value.fraction ?? candidate.value.value,
          desc.themeKeys ?? [],
        )

        // Automatically handle things like `w-1/2` without requiring `1/2` to
        // exist as a theme value.
        if (value === null && desc.supportsFractions && candidate.value.fraction) {
          value = `calc(${candidate.value.fraction} * 100%)`
        }

        // If there is still no value but the utility supports bare values, then
        // use the bare candidate value as the value.
        if (value === null && desc.handleBareValue) {
          value = desc.handleBareValue(candidate.value)
        }
      }

      // If there is no value, don't generate any rules.
      if (value === null) return

      // Negate the value if the candidate has a negative prefix.
      return desc.handle(withNegative(value, candidate))
    })

    suggest(classRoot, () => [
      {
        supportsNegative: desc.supportsNegative,
        valueThemeKeys: desc.themeKeys ?? [],
        hasDefaultValue: desc.defaultValue !== undefined && desc.defaultValue !== null,
      },
    ])
  }

  type ColorUtilityDescription = {
    themeKeys: ColorThemeKey[]
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

      // Color utilities never support negative values as there's no sensible
      // way to negate a color.
      if (candidate.negative) return

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
        modifierThemeKeys: ['--opacity'],
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
  staticUtility('inset-auto', [['inset', 'auto']])
  utilities.static('inset-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('inset', value)]
  })
  functionalUtility('inset', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [decl('inset', value)],
  })

  staticUtility('inset-x-auto', [
    ['--tw-sort', 'inset-inline'],
    ['right', 'auto'],
    ['left', 'auto'],
  ])

  utilities.static('inset-x-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('--tw-sort', 'inset-inline'), decl('right', value), decl('left', value)]
  })
  functionalUtility('inset-x', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [
      decl('--tw-sort', 'inset-inline'),
      decl('right', value),
      decl('left', value),
    ],
  })

  staticUtility('inset-y-auto', [
    ['--tw-sort', 'inset-block'],
    ['top', 'auto'],
    ['bottom', 'auto'],
  ])
  utilities.static('inset-y-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('--tw-sort', 'inset-block'), decl('top', value), decl('bottom', value)]
  })
  functionalUtility('inset-y', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [
      decl('--tw-sort', 'inset-block'),
      decl('top', value),
      decl('bottom', value),
    ],
  })

  staticUtility('start-auto', [['inset-inline-start', 'auto']])
  utilities.static('start-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('inset-inline-start', value)]
  })
  functionalUtility('start', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [decl('inset-inline-start', value)],
  })

  staticUtility('end-auto', [['inset-inline-end', 'auto']])
  utilities.static('end-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('inset-inline-end', value)]
  })
  functionalUtility('end', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [decl('inset-inline-end', value)],
  })

  staticUtility('top-auto', [['top', 'auto']])
  utilities.static('top-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('top', value)]
  })
  functionalUtility('top', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [decl('top', value)],
  })

  staticUtility('right-auto', [['right', 'auto']])
  utilities.static('right-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('right', value)]
  })
  functionalUtility('right', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [decl('right', value)],
  })

  staticUtility('bottom-auto', [['bottom', 'auto']])
  utilities.static('bottom-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('bottom', value)]
  })
  functionalUtility('bottom', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [decl('bottom', value)],
  })

  staticUtility('left-auto', [['left', 'auto']])
  utilities.static('left-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'
    return [decl('left', value)]
  })
  functionalUtility('left', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--inset', '--spacing'],
    handle: (value) => [decl('left', value)],
  })

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
      if (!Number.isInteger(Number(value))) return null
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
  staticUtility('order-first', [['order', 'calc(-infinity)']])
  staticUtility('order-last', [['order', 'calc(infinity)']])
  staticUtility('order-none', [['order', '0']])
  functionalUtility('order', {
    supportsNegative: true,
    handleBareValue: ({ value }) => {
      if (!Number.isInteger(Number(value))) return null
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
    themeKeys: ['--grid-column'],
    handle: (value) => [decl('grid-column', value)],
  })
  staticUtility('col-span-full', [['grid-column', '1 / -1']])
  functionalUtility('col-span', {
    handleBareValue: ({ value }) => {
      if (!Number.isInteger(Number(value))) return null
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
      if (!Number.isInteger(Number(value))) return null
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
      if (!Number.isInteger(Number(value))) return null
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
    themeKeys: ['--grid-row'],
    handle: (value) => [decl('grid-row', value)],
  })
  staticUtility('row-span-full', [['grid-row', '1 / -1']])
  functionalUtility('row-span', {
    themeKeys: [],
    handleBareValue: ({ value }) => {
      if (!Number.isInteger(Number(value))) return null
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
      if (!Number.isInteger(Number(value))) return null
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
      if (!Number.isInteger(Number(value))) return null
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
  staticUtility('float-start', [['float', 'start']])
  staticUtility('float-end', [['float', 'end']])
  staticUtility('float-right', [['float', 'right']])
  staticUtility('float-left', [['float', 'left']])
  staticUtility('float-none', [['float', 'none']])

  /**
   * @css `clear`
   */
  staticUtility('clear-start', [['clear', 'start']])
  staticUtility('clear-end', [['clear', 'end']])
  staticUtility('clear-right', [['clear', 'right']])
  staticUtility('clear-left', [['clear', 'left']])
  staticUtility('clear-both', [['clear', 'both']])
  staticUtility('clear-none', [['clear', 'none']])

  /**
   * @css `margin`
   */
  for (let [namespace, properties, sort] of [
    ['m', ['margin']],
    ['mx', ['margin-left', 'margin-right'], 'margin-inline'],
    ['my', ['margin-top', 'margin-bottom'], 'margin-block'],
    ['ms', ['margin-inline-start']],
    ['me', ['margin-inline-end']],
    ['mt', ['margin-top']],
    ['mr', ['margin-right']],
    ['mb', ['margin-bottom']],
    ['ml', ['margin-left']],
  ] as const) {
    staticUtility(
      `${namespace}-auto`,
      properties.map((property) => [property, 'auto']),
    )
    functionalUtility(namespace, {
      supportsNegative: true,
      themeKeys: ['--margin', '--spacing'],
      handle: (value) => [
        ...(sort ? [decl('--tw-sort', sort)] : []),
        ...properties.map((property) => decl(property, value)),
      ],
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
      if (!Number.isInteger(Number(value))) return null
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
  staticUtility('grid', [['display', 'grid']])
  staticUtility('inline-grid', [['display', 'inline-grid']])
  staticUtility('contents', [['display', 'contents']])
  staticUtility('list-item', [['display', 'list-item']])

  /**
   * @css `aspect-ratio`
   */
  staticUtility('aspect-auto', [['aspect-ratio', 'auto']])
  staticUtility('aspect-square', [['aspect-ratio', '1 / 1']])
  staticUtility('aspect-video', [['aspect-ratio', '16 / 9']])
  functionalUtility('aspect', {
    themeKeys: ['--aspect-ratio'],
    handleBareValue: ({ fraction }) => {
      if (fraction === null) return null
      let [lhs, rhs] = segment(fraction, '/')
      if (!Number.isInteger(Number(lhs))) return null
      if (!Number.isInteger(Number(rhs))) return null
      return fraction
    },
    handle: (value) => [decl('aspect-ratio', value)],
  })

  /**
   * @css `size`
   * @css `width`
   * @css `height`
   */
  for (let [key, value] of [
    ['auto', 'auto'],
    ['full', '100%'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`size-${key}`, [
      ['--tw-sort', 'size'],
      ['width', value],
      ['height', value],
    ])
  }
  functionalUtility('size', {
    supportsFractions: true,
    themeKeys: ['--size', '--spacing'],
    handle: (value) => [decl('--tw-sort', 'size'), decl('width', value), decl('height', value)],
  })

  /**
   * @css `width`
   */
  for (let [key, value] of [
    ['auto', 'auto'],
    ['full', '100%'],
    ['screen', '100vw'],
    ['svw', '100svw'],
    ['lvw', '100lvw'],
    ['dvw', '100dvw'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`w-${key}`, [['width', value]])
  }
  functionalUtility('w', {
    supportsFractions: true,
    themeKeys: ['--width', '--spacing'],
    handle: (value) => [decl('width', value)],
  })

  /**
   * @css `min-width`
   */
  for (let [key, value] of [
    ['auto', 'auto'],
    ['full', '100%'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`min-w-${key}`, [['min-width', value]])
  }
  functionalUtility('min-w', {
    themeKeys: ['--min-width', '--width', '--spacing'],
    handle: (value) => [decl('min-width', value)],
  })

  /**
   * @css `max-width`
   */
  for (let [key, value] of [
    ['none', 'none'],
    ['full', '100%'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`max-w-${key}`, [['max-width', value]])
  }
  functionalUtility('max-w', {
    themeKeys: ['--max-width', '--width', '--spacing'],
    handle: (value) => [decl('max-width', value)],
  })

  /**
   * @css `height`
   */
  for (let [key, value] of [
    ['auto', 'auto'],
    ['full', '100%'],
    ['screen', '100vh'],
    ['svh', '100svh'],
    ['lvh', '100lvh'],
    ['dvh', '100dvh'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`h-${key}`, [['height', value]])
  }
  functionalUtility('h', {
    supportsFractions: true,
    themeKeys: ['--height', '--spacing'],
    handle: (value) => [decl('height', value)],
  })

  /**
   * @css `min-height`
   */
  for (let [key, value] of [
    ['auto', 'auto'],
    ['full', '100%'],
    ['screen', '100vh'],
    ['svh', '100svh'],
    ['lvh', '100lvh'],
    ['dvh', '100dvh'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`min-h-${key}`, [['min-height', value]])
  }
  functionalUtility('min-h', {
    themeKeys: ['--min-height', '--spacing'],
    handle: (value) => [decl('min-height', value)],
  })

  /**
   * @css `max-height`
   */
  for (let [key, value] of [
    ['none', 'none'],
    ['full', '100%'],
    ['screen', '100vh'],
    ['svh', '100svh'],
    ['lvh', '100lvh'],
    ['dvh', '100dvh'],
    ['min', 'min-content'],
    ['max', 'max-content'],
    ['fit', 'fit-content'],
  ]) {
    staticUtility(`max-h-${key}`, [['max-height', value]])
  }
  functionalUtility('max-h', {
    themeKeys: ['--max-height', '--spacing'],
    handle: (value) => [decl('max-height', value)],
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
    if (candidate.negative) return

    if (!candidate.value) {
      return [decl('display', 'flex')]
    }

    if (candidate.value.kind === 'arbitrary') {
      return [decl('flex', candidate.value.value)]
    }

    if (candidate.value.fraction) {
      return [decl('flex', `calc(${candidate.value.fraction} * 100%)`)]
    }

    if (Number.isInteger(Number(candidate.value.value))) {
      return [decl('flex', candidate.value.value)]
    }
  })

  /**
   * @css `flex-shrink`
   */
  functionalUtility('shrink', {
    defaultValue: '1',
    handleBareValue: ({ value }) => {
      if (Number.isNaN(Number(value))) return null
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
      if (Number.isNaN(Number(value))) return null
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
  functionalUtility('basis', {
    supportsFractions: true,
    themeKeys: ['--flex-basis', '--width', '--spacing'],
    handle: (value) => [decl('flex-basis', value)],
  })

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
  functionalUtility('border-spacing', {
    themeKeys: ['--border-spacing', '--spacing'],
    handle: (value) => [
      borderSpacingProperties(),
      decl('--tw-border-spacing-x', value),
      decl('--tw-border-spacing-y', value),
      decl('border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'),
    ],
  })

  /**
   * @css `border-spacing`
   */
  functionalUtility('border-spacing-x', {
    themeKeys: ['--border-spacing', '--spacing'],
    handle: (value) => [
      borderSpacingProperties(),
      decl('--tw-border-spacing-x', value),
      decl('border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'),
    ],
  })

  /**
   * @css `border-spacing`
   */
  functionalUtility('border-spacing-y', {
    themeKeys: ['--border-spacing', '--spacing'],
    handle: (value) => [
      borderSpacingProperties(),
      decl('--tw-border-spacing-y', value),
      decl('border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'),
    ],
  })

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
      property('--tw-translate-x', '0', '<length> | <percentage>'),
      property('--tw-translate-y', '0', '<length> | <percentage>'),
      property('--tw-translate-z', '0', '<length>'),
    ])

  /**
   * @css `translate`
   */
  staticUtility('translate-none', [['translate', 'none']])
  utilities.static('translate-full', (candidate) => {
    let value = candidate.negative ? '-100%' : '100%'

    return [
      translateProperties(),
      decl('--tw-translate-x', value),
      decl('--tw-translate-y', value),
      decl('--tw-translate-z', value),
      decl('translate', 'var(--tw-translate-x) var(--tw-translate-y)'),
    ]
  })

  functionalUtility('translate', {
    supportsNegative: true,
    supportsFractions: true,
    themeKeys: ['--translate', '--spacing'],
    handle: (value) => [
      translateProperties(),
      decl('--tw-translate-x', value),
      decl('--tw-translate-y', value),
      decl('--tw-translate-z', value),
      decl('translate', 'var(--tw-translate-x) var(--tw-translate-y)'),
    ],
  })

  for (let axis of ['x', 'y']) {
    let handle = (value: string) => [
      translateProperties(),
      decl(`--tw-translate-${axis}`, value),
      decl('translate', `var(--tw-translate-x) var(--tw-translate-y)`),
    ]

    /**
     * @css `translate`
     */
    functionalUtility(`translate-${axis}`, {
      supportsNegative: true,
      supportsFractions: true,
      themeKeys: ['--translate', '--spacing'],
      handle,
    })
    utilities.static(`translate-${axis}-px`, (candidate) => {
      return handle(candidate.negative ? '-1px' : '1px')
    })
    utilities.static(`translate-${axis}-full`, (candidate) => {
      return handle(candidate.negative ? '-100%' : '100%')
    })
  }
  functionalUtility(`translate-z`, {
    supportsNegative: true,
    supportsFractions: false,
    themeKeys: ['--translate', '--spacing'],
    handle: (value) => {
      return [
        translateProperties(),
        decl(`--tw-translate-z`, value),
        decl('translate', 'var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)'),
      ]
    },
  })
  utilities.static(`translate-z-px`, (candidate) => {
    return [
      translateProperties(),
      decl(`--tw-translate-z`, candidate.negative ? '-1px' : '1px'),
      decl('translate', 'var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)'),
    ]
  })

  /**
   * @css `translate`
   */
  staticUtility('translate-3d', [
    translateProperties,
    ['translate', 'var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)'],
  ])

  let scaleProperties = () =>
    atRoot([
      property('--tw-scale-x', '1', '<number> | <percentage>'),
      property('--tw-scale-y', '1', '<number> | <percentage>'),
      property('--tw-scale-z', '1', '<number> | <percentage>'),
    ])

  /**
   * @css `scale`
   */
  staticUtility('scale-none', [['scale', 'none']])
  utilities.functional('scale', (candidate) => {
    if (!candidate.value) return
    let value
    if (candidate.value.kind === 'arbitrary') {
      value = candidate.value.value
      return [decl('scale', value)]
    } else {
      value = theme.resolve(candidate.value.value, ['--scale'])
      if (!value && !Number.isNaN(Number(candidate.value.value))) {
        value = `${candidate.value.value}%`
      }
      if (!value) return
    }
    value = withNegative(value, candidate)
    return [
      scaleProperties(),
      decl('--tw-scale-x', value),
      decl('--tw-scale-y', value),
      decl('--tw-scale-z', value),
      decl('scale', `var(--tw-scale-x) var(--tw-scale-y)`),
    ]
  })

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
        if (Number.isNaN(Number(value))) return null
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
  utilities.functional('rotate', (candidate) => {
    if (!candidate.value) return
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
      if (!value && !Number.isNaN(Number(candidate.value.value))) {
        value = `${candidate.value.value}deg`
      }
      if (!value) return
    }
    value = withNegative(value, candidate)
    return [decl('rotate', value)]
  })

  suggest('rotate', () => [
    {
      supportsNegative: true,
      values: ['0', '1', '2', '3', '6', '12', '45', '90', '180'],
      valueThemeKeys: ['--rotate'],
    },
  ])

  {
    let transformValue = [
      'var(--tw-rotate-x)',
      'var(--tw-rotate-y)',
      'var(--tw-rotate-z)',
      'var(--tw-skew-x)',
      'var(--tw-skew-y)',
    ].join(' ')

    let transformProperties = () =>
      atRoot([
        property('--tw-rotate-x', 'rotateX(0)', '<transform-function>'),
        property('--tw-rotate-y', 'rotateY(0)', '<transform-function>'),
        property('--tw-rotate-z', 'rotateZ(0)', '<transform-function>'),
        property('--tw-skew-x', 'skewX(0)', '<transform-function>'),
        property('--tw-skew-y', 'skewY(0)', '<transform-function>'),
      ])

    for (let axis of ['x', 'y', 'z']) {
      functionalUtility(`rotate-${axis}`, {
        supportsNegative: true,
        themeKeys: ['--rotate'],
        handleBareValue: ({ value }) => {
          if (Number.isNaN(Number(value))) return null
          return `rotate${axis.toUpperCase()}(${value}deg)`
        },
        handle: (value) => [
          transformProperties(),
          decl(`--tw-rotate-${axis}`, value),
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
      if (candidate.negative) return

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
  staticUtility('resize-both', [['resize', 'both']])
  staticUtility('resize-x', [['resize', 'horizontal']])
  staticUtility('resize-y', [['resize', 'vertical']])

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

  functionalUtility('scroll-m', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin', value)],
  })

  functionalUtility('scroll-mx', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-left', value), decl('scroll-margin-right', value)],
  })

  functionalUtility('scroll-my', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-top', value), decl('scroll-margin-bottom', value)],
  })

  functionalUtility('scroll-ms', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-inline-start', value)],
  })

  functionalUtility('scroll-me', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-inline-end', value)],
  })

  functionalUtility('scroll-mt', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-top', value)],
  })

  functionalUtility('scroll-mr', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-right', value)],
  })

  functionalUtility('scroll-mb', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-bottom', value)],
  })

  functionalUtility('scroll-ml', {
    supportsNegative: true,
    themeKeys: ['--scroll-margin', '--spacing'],
    handle: (value) => [decl('scroll-margin-left', value)],
  })

  // scroll-padding
  functionalUtility('scroll-p', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding', value)],
  })

  functionalUtility('scroll-px', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-left', value), decl('scroll-padding-right', value)],
  })

  functionalUtility('scroll-py', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-top', value), decl('scroll-padding-bottom', value)],
  })

  functionalUtility('scroll-ps', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-inline-start', value)],
  })

  functionalUtility('scroll-pe', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-inline-end', value)],
  })

  functionalUtility('scroll-pt', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-top', value)],
  })

  functionalUtility('scroll-pr', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-right', value)],
  })

  functionalUtility('scroll-pb', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-bottom', value)],
  })

  functionalUtility('scroll-pl', {
    supportsNegative: true,
    themeKeys: ['--scroll-padding', '--spacing'],
    handle: (value) => [decl('scroll-padding-left', value)],
  })

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

  // columns-*
  staticUtility('columns-auto', [['columns', 'auto']])

  functionalUtility('columns', {
    themeKeys: ['--columns', '--width'],
    handleBareValue: ({ value }) => {
      if (!Number.isInteger(Number(value))) return null
      return value
    },
    handle: (value) => [decl('columns', value)],
  })

  suggest('columns', () => [
    {
      values: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
      valueThemeKeys: ['--columns', '--width'],
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
      if (!Number.isInteger(Number(value))) return null
      return `repeat(${value}, minmax(0, 1fr))`
    },
    handle: (value) => [decl('grid-template-columns', value)],
  })

  staticUtility('grid-rows-none', [['grid-template-rows', 'none']])
  staticUtility('grid-rows-subgrid', [['grid-template-rows', 'subgrid']])
  functionalUtility('grid-rows', {
    themeKeys: ['--grid-template-rows'],
    handleBareValue: ({ value }) => {
      if (!Number.isInteger(Number(value))) return null
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
  staticUtility('place-content-between', [['place-content', 'between']])
  staticUtility('place-content-around', [['place-content', 'around']])
  staticUtility('place-content-evenly', [['place-content', 'evenly']])
  staticUtility('place-content-baseline', [['place-content', 'baseline']])
  staticUtility('place-content-stretch', [['place-content', 'stretch']])

  staticUtility('place-items-center', [['place-items', 'center']])
  staticUtility('place-items-start', [['place-items', 'start']])
  staticUtility('place-items-end', [['place-items', 'end']])
  staticUtility('place-items-baseline', [['place-items', 'baseline']])
  staticUtility('place-items-stretch', [['place-items', 'stretch']])

  staticUtility('content-normal', [['align-content', 'normal']])
  staticUtility('content-center', [['align-content', 'center']])
  staticUtility('content-start', [['align-content', 'flex-start']])
  staticUtility('content-end', [['align-content', 'flex-end']])
  staticUtility('content-between', [['align-content', 'space-between']])
  staticUtility('content-around', [['align-content', 'space-around']])
  staticUtility('content-evenly', [['align-content', 'space-evenly']])
  staticUtility('content-baseline', [['align-content', 'baseline']])
  staticUtility('content-stretch', [['align-content', 'stretch']])

  staticUtility('items-center', [['align-items', 'center']])
  staticUtility('items-start', [['align-items', 'flex-start']])
  staticUtility('items-end', [['align-items', 'flex-end']])
  staticUtility('items-baseline', [['align-items', 'baseline']])
  staticUtility('items-stretch', [['align-items', 'stretch']])

  staticUtility('justify-normal', [['justify-content', 'normal']])
  staticUtility('justify-center', [['justify-content', 'center']])
  staticUtility('justify-start', [['justify-content', 'flex-start']])
  staticUtility('justify-end', [['justify-content', 'flex-end']])
  staticUtility('justify-between', [['justify-content', 'space-between']])
  staticUtility('justify-around', [['justify-content', 'space-around']])
  staticUtility('justify-evenly', [['justify-content', 'space-evenly']])
  staticUtility('justify-baseline', [['justify-content', 'baseline']])
  staticUtility('justify-stretch', [['justify-content', 'stretch']])

  staticUtility('justify-items-normal', [['justify-items', 'normal']])
  staticUtility('justify-items-center', [['justify-items', 'center']])
  staticUtility('justify-items-start', [['justify-items', 'start']])
  staticUtility('justify-items-end', [['justify-items', 'end']])
  staticUtility('justify-items-stretch', [['justify-items', 'stretch']])

  functionalUtility('gap', {
    themeKeys: ['--gap', '--spacing'],
    handle: (value) => [decl('gap', value)],
  })

  functionalUtility('gap-x', {
    themeKeys: ['--gap', '--spacing'],
    handle: (value) => [decl('column-gap', value)],
  })

  functionalUtility('gap-y', {
    themeKeys: ['--gap', '--spacing'],
    handle: (value) => [decl('row-gap', value)],
  })

  functionalUtility('space-x', {
    supportsNegative: true,
    themeKeys: ['--space', '--spacing'],
    handle: (value) => [
      atRoot([property('--tw-space-x-reverse', '0', '<number>')]),

      rule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'row-gap'),
        decl('margin-inline-start', `calc(${value} * var(--tw-space-x-reverse))`),
        decl('margin-inline-end', `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`),
      ]),
    ],
  })

  functionalUtility('space-y', {
    supportsNegative: true,
    themeKeys: ['--space', '--spacing'],
    handle: (value) => [
      atRoot([property('--tw-space-y-reverse', '0', '<number>')]),

      rule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'column-gap'),
        decl('margin-top', `calc(${value} * var(--tw-space-y-reverse))`),
        decl('margin-bottom', `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`),
      ]),
    ],
  })

  staticUtility('space-x-reverse', [
    () => atRoot([property('--tw-space-x-reverse', '0', '<number>')]),
    () =>
      rule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'row-gap'),
        decl('--tw-space-x-reverse', '1'),
      ]),
  ])

  staticUtility('space-y-reverse', [
    () => atRoot([property('--tw-space-y-reverse', '0', '<number>')]),
    () =>
      rule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'column-gap'),
        decl('--tw-space-y-reverse', '1'),
      ]),
  ])

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
      rule(':where(& > :not(:last-child))', [
        decl('--tw-sort', 'divide-color'),
        decl('border-color', value),
      ]),
    ],
  })

  staticUtility('place-self-auto', [['place-self', 'auto']])
  staticUtility('place-self-start', [['place-self', 'start']])
  staticUtility('place-self-end', [['place-self', 'end']])
  staticUtility('place-self-center', [['place-self', 'center']])
  staticUtility('place-self-stretch', [['place-self', 'stretch']])

  staticUtility('self-auto', [['align-self', 'auto']])
  staticUtility('self-start', [['align-self', 'flex-start']])
  staticUtility('self-end', [['align-self', 'flex-end']])
  staticUtility('self-center', [['align-self', 'center']])
  staticUtility('self-stretch', [['align-self', 'stretch']])
  staticUtility('self-baseline', [['align-self', 'baseline']])

  staticUtility('justify-self-auto', [['justify-self', 'auto']])
  staticUtility('justify-self-start', [['justify-self', 'flex-start']])
  staticUtility('justify-self-end', [['justify-self', 'flex-end']])
  staticUtility('justify-self-center', [['justify-self', 'center']])
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
  staticUtility('break-keep', [['word-break', 'break-keep']])

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
      return atRoot([property('--tw-border-style', 'solid', '<custom-ident>')])
    }

    function borderSideUtility(classRoot: string, desc: BorderDescription) {
      utilities.functional(classRoot, (candidate) => {
        if (candidate.negative) return

        if (!candidate.value) {
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
          let value = theme.resolve(candidate.value.value, ['--border-width'])
          if (value) {
            let decls = desc.width(value)
            if (!decls) return
            return [borderProperties(), ...decls]
          }

          if (!Number.isNaN(Number(candidate.value.value))) {
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
          modifierThemeKeys: ['--opacity'],
          hasDefaultValue: true,
        },
        {
          values: [],
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
        decl('border-left-style', 'var(--tw-border-style)'),
        decl('border-right-style', 'var(--tw-border-style)'),
        decl('border-left-width', value),
        decl('border-right-width', value),
      ],
      color: (value) => [decl('border-left-color', value), decl('border-right-color', value)],
    })

    borderSideUtility('border-y', {
      width: (value) => [
        decl('border-top-style', 'var(--tw-border-style)'),
        decl('border-bottom-style', 'var(--tw-border-style)'),
        decl('border-top-width', value),
        decl('border-bottom-width', value),
      ],
      color: (value) => [decl('border-top-color', value), decl('border-bottom-color', value)],
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
        if (Number.isNaN(Number(value))) return null
        return `${value}px`
      },
      handle: (value) => [
        atRoot([property('--tw-divide-x-reverse', '0', '<number>')]),

        rule(':where(& > :not(:last-child))', [
          decl('--tw-sort', 'divide-x-width'),
          borderProperties(),
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
        if (Number.isNaN(Number(value))) return null
        return `${value}px`
      },
      handle: (value) => [
        atRoot([property('--tw-divide-y-reverse', '0', '<number>')]),

        rule(':where(& > :not(:last-child))', [
          decl('--tw-sort', 'divide-y-width'),
          borderProperties(),
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
      () => atRoot([property('--tw-divide-x-reverse', '0', '<number>')]),
      () => rule(':where(& > :not(:last-child))', [decl('--tw-divide-x-reverse', '1')]),
    ])

    staticUtility('divide-y-reverse', [
      () => atRoot([property('--tw-divide-y-reverse', '0', '<number>')]),
      () => rule(':where(& > :not(:last-child))', [decl('--tw-divide-y-reverse', '1')]),
    ])

    for (let value of ['solid', 'dashed', 'dotted', 'double', 'none']) {
      staticUtility(`divide-${value}`, [
        () =>
          rule(':where(& > :not(:last-child))', [
            decl('--tw-sort', 'divide-style'),
            decl('--tw-border-style', value),
            decl('border-style', value),
          ]),
      ])
    }
  }

  staticUtility('bg-inherit', [['background-color', 'inherit']])
  staticUtility('bg-transparent', [['background-color', 'transparent']])

  staticUtility('bg-auto', [['background-size', 'auto']])
  staticUtility('bg-cover', [['background-size', 'cover']])
  staticUtility('bg-contain', [['background-size', 'contain']])

  staticUtility('bg-fixed', [['background-attachment', 'fixed']])
  staticUtility('bg-local', [['background-attachment', 'local']])
  staticUtility('bg-scroll', [['background-attachment', 'scroll']])

  staticUtility('bg-center', [['background-position', 'center']])
  staticUtility('bg-top', [['background-position', 'top']])
  staticUtility('bg-right-top', [['background-position', 'right top']])
  staticUtility('bg-right', [['background-position', 'right']])
  staticUtility('bg-right-bottom', [['background-position', 'right bottom']])
  staticUtility('bg-bottom', [['background-position', 'bottom']])
  staticUtility('bg-left-bottom', [['background-position', 'left bottom']])
  staticUtility('bg-left', [['background-position', 'left']])
  staticUtility('bg-left-top', [['background-position', 'left top']])

  staticUtility('bg-repeat', [['background-repeat', 'repeat']])
  staticUtility('bg-no-repeat', [['background-repeat', 'no-repeat']])
  staticUtility('bg-repeat-x', [['background-repeat', 'repeat-x']])
  staticUtility('bg-repeat-y', [['background-repeat', 'repeat-y']])
  staticUtility('bg-round', [['background-repeat', 'round']])
  staticUtility('bg-space', [['background-repeat', 'space']])

  staticUtility('bg-none', [['background-image', 'none']])

  for (let [value, direction] of [
    ['t', 'top'],
    ['tr', 'top right'],
    ['r', 'right'],
    ['br', 'bottom right'],
    ['b', 'bottom'],
    ['bl', 'bottom left'],
    ['l', 'left'],
    ['tl', 'top left'],
  ]) {
    staticUtility(`bg-gradient-to-${value}`, [
      ['background-image', `linear-gradient(to ${direction}, var(--tw-gradient-stops,))`],
    ])

    staticUtility(`bg-linear-to-${value}`, [
      ['background-image', `linear-gradient(to ${direction}, var(--tw-gradient-stops,))`],
    ])
  }

  utilities.functional('bg-linear', (candidate) => {
    if (!candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type = candidate.value.dataType ?? inferDataType(value, ['angle'])

      switch (type) {
        case 'angle': {
          value = withNegative(value, candidate)

          return [decl('background-image', `linear-gradient(${value}, var(--tw-gradient-stops,))`)]
        }
        default: {
          if (candidate.negative) return

          return [decl('background-image', `linear-gradient(${value}, var(--tw-gradient-stops,))`)]
        }
      }
    }
  })

  utilities.functional('bg', (candidate) => {
    if (candidate.negative || !candidate.value) return

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
          return [decl('background-position', value)]
        }
        case 'bg-size':
        case 'length':
        case 'size': {
          return [decl('background-size', value)]
        }
        case 'image':
        case 'url': {
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
      modifierThemeKeys: ['--opacity'],
    },
    {
      values: [],
      valueThemeKeys: ['--background-image'],
    },
  ])

  let gradientStopProperties = () => {
    return atRoot([
      property('--tw-gradient-from', '#0000', '<color>'),
      property('--tw-gradient-to', '#0000', '<color>'),
      property('--tw-gradient-from', 'transparent', '<color>'),
      property('--tw-gradient-via', 'transparent', '<color>'),
      property('--tw-gradient-to', 'transparent', '<color>'),
      property('--tw-gradient-stops'),
      property('--tw-gradient-via-stops'),
      property('--tw-gradient-from-position', '0%', '<length> | <percentage>'),
      property('--tw-gradient-via-position', '50%', '<length> | <percentage>'),
      property('--tw-gradient-to-position', '100%', '<length> | <percentage>'),
    ])
  }

  type GradientStopDescription = {
    color: (value: string) => AstNode[] | undefined
    position: (value: string) => AstNode[] | undefined
  }

  function gradientStopUtility(classRoot: string, desc: GradientStopDescription) {
    utilities.functional(classRoot, (candidate) => {
      if (candidate.negative || !candidate.value) return

      // Arbitrary values
      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type =
          candidate.value.dataType ?? inferDataType(value, ['color', 'length', 'percentage'])

        switch (type) {
          case 'length':
          case 'percentage': {
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
        let value = theme.resolve(candidate.value.value, ['--gradient-color-stop-positions'])
        if (value) {
          return desc.position(value)
        } else if (
          candidate.value.value[candidate.value.value.length - 1] === '%' &&
          !Number.isNaN(Number(candidate.value.value.slice(0, -1)))
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
        modifierThemeKeys: ['--opacity'],
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
        'var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))',
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
        'var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)',
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
        'var(--tw-gradient-via-stops, var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))',
      ),
    ],
    position: (value) => [gradientStopProperties(), decl('--tw-gradient-to-position', value)],
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

  utilities.functional('fill', (candidate) => {
    if (candidate.negative || !candidate.value) return

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
      modifierThemeKeys: ['--opacity'],
    },
  ])

  staticUtility('stroke-none', [['stroke', 'none']])
  utilities.functional('stroke', (candidate) => {
    if (candidate.negative || !candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type =
        candidate.value.dataType ??
        inferDataType(value, ['color', 'number', 'length', 'percentage'])

      switch (type) {
        case 'number':
        case 'length':
        case 'percentage': {
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
      } else if (!Number.isNaN(Number(candidate.value.value))) {
        return [decl('stroke-width', candidate.value.value)]
      }
    }
  })

  suggest('stroke', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--stroke', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      modifierThemeKeys: ['--opacity'],
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

  staticUtility('object-bottom', [['object-position', 'bottom']])
  staticUtility('object-center', [['object-position', 'center']])
  staticUtility('object-left', [['object-position', 'left']])
  staticUtility('object-left-bottom', [['object-position', 'left bottom']])
  staticUtility('object-left-top', [['object-position', 'left top']])
  staticUtility('object-right', [['object-position', 'right']])
  staticUtility('object-right-bottom', [['object-position', 'right bottom']])
  staticUtility('object-right-top', [['object-position', 'right top']])
  staticUtility('object-top', [['object-position', 'top']])
  functionalUtility('object', {
    themeKeys: ['--object-position'],
    handle: (value) => [decl('object-position', value)],
  })

  functionalUtility('p', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding', value)],
  })

  functionalUtility('px', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-left', value), decl('padding-right', value)],
  })

  functionalUtility('py', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-top', value), decl('padding-bottom', value)],
  })

  functionalUtility('pt', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-top', value)],
  })
  functionalUtility('ps', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-inline-start', value)],
  })
  functionalUtility('pe', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-inline-end', value)],
  })
  functionalUtility('pr', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-right', value)],
  })
  functionalUtility('pb', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-bottom', value)],
  })
  functionalUtility('pl', {
    themeKeys: ['--padding', '--spacing'],
    handle: (value) => [decl('padding-left', value)],
  })

  staticUtility('text-left', [['text-align', 'left']])
  staticUtility('text-center', [['text-align', 'center']])
  staticUtility('text-right', [['text-align', 'right']])
  staticUtility('text-justify', [['text-align', 'justify']])
  staticUtility('text-start', [['text-align', 'start']])
  staticUtility('text-end', [['text-align', 'end']])

  functionalUtility('indent', {
    supportsNegative: true,
    themeKeys: ['--text-indent', '--spacing'],
    handle: (value) => [decl('text-indent', value)],
  })

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
    if (candidate.negative || !candidate.value) return

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
          return [decl('font-weight', value)]
        }
      }
    }

    {
      let value = theme.resolveWith(
        candidate.value.value,
        ['--font-family'],
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
        return [decl('font-weight', value)]
      }

      switch (candidate.value.value) {
        case 'thin':
          value = '100'
          break
        case 'extralight':
          value = '200'
          break
        case 'light':
          value = '300'
          break
        case 'normal':
          value = '400'
          break
        case 'medium':
          value = '500'
          break
        case 'semibold':
          value = '600'
          break
        case 'bold':
          value = '700'
          break
        case 'extrabold':
          value = '800'
          break
        case 'black':
          value = '900'
          break
      }

      if (value) {
        return [decl('font-weight', value)]
      }
    }
  })

  suggest('font', () => [
    {
      values: [],
      valueThemeKeys: ['--font-family'],
    },
    {
      values: [
        'thin',
        'extralight',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ],
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
      rule('&::placeholder', [decl('--tw-sort', 'placeholder-color'), decl('color', value)]),
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
    if (candidate.negative || !candidate.value) return

    if (candidate.value.kind === 'arbitrary') {
      let value: string | null = candidate.value.value
      let type = candidate.value.dataType ?? inferDataType(value, ['color', 'length', 'percentage'])

      switch (type) {
        case 'length':
        case 'percentage': {
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
        return [decl('text-decoration-thickness', value)]
      }

      if (!Number.isNaN(Number(candidate.value.value))) {
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
      modifierThemeKeys: ['--opacity'],
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
      if (candidate.negative) return

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
      if (candidate.negative) return

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

    functionalUtility('backdrop-blur', {
      themeKeys: ['--backdrop-blur', '--blur'],
      handle: (value) => [
        backdropFilterProperties(),
        decl('--tw-backdrop-blur', `blur(${value})`),
        decl('-webkit-backdrop-filter', cssBackdropFilterValue),
        decl('backdrop-filter', cssBackdropFilterValue),
      ],
    })

    functionalUtility('brightness', {
      themeKeys: ['--brightness'],
      handleBareValue: ({ value }) => {
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
      themeKeys: ['--hue-rotate'],
      handleBareValue: ({ value }) => {
        if (Number.isNaN(Number(value))) return null
        return `${value}deg`
      },
      handle: (value) => [
        filterProperties(),
        decl('--tw-hue-rotate', `hue-rotate(${value})`),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-hue-rotate', {
      themeKeys: ['--backdrop-hue-rotate', '--hue-rotate'],
      handleBareValue: ({ value }) => {
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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
        if (Number.isNaN(Number(value))) return null
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

    functionalUtility('drop-shadow', {
      themeKeys: ['--drop-shadow'],
      handle: (value) => [
        filterProperties(),
        decl(
          '--tw-drop-shadow',
          segment(value, ',')
            .map((v) => `drop-shadow(${v})`)
            .join(' '),
        ),
        decl('filter', cssFilterValue),
      ],
    })

    functionalUtility('backdrop-opacity', {
      themeKeys: ['--backdrop-opacity', '--opacity'],
      handleBareValue: ({ value }) => {
        if (Number.isNaN(Number(value))) return null
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
    let defaultTimingFunction = theme.get(['--default-transition-timing-function']) ?? 'ease'
    let defaultDuration = theme.get(['--default-transition-duration']) ?? '0s'

    staticUtility('transition-none', [['transition-property', 'none']])
    staticUtility('transition-all', [
      ['transition-property', 'all'],
      ['transition-timing-function', defaultTimingFunction],
      ['transition-duration', defaultDuration],
    ])
    staticUtility('transition-colors', [
      [
        'transition-property',
        'color, background-color, border-color, text-decoration-color, fill, stroke',
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
        'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter',
      themeKeys: ['--transition-property'],
      handle: (value) => [
        decl('transition-property', value),
        decl('transition-timing-function', defaultTimingFunction),
        decl('transition-duration', defaultDuration),
      ],
    })

    functionalUtility('delay', {
      handleBareValue: ({ value }) => {
        if (Number.isNaN(Number(value))) return null
        return `${value}ms`
      },
      themeKeys: ['--transition-delay'],
      handle: (value) => [decl('transition-delay', value)],
    })

    utilities.functional('duration', (candidate) => {
      // This utility doesn't support negative values.
      if (candidate.negative) return

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

        if (value === null && !Number.isNaN(Number(candidate.value.value))) {
          value = `${candidate.value.value}ms`
        }
      }

      // If the candidate value (like the `sm` in `max-w-sm`) doesn't resolve to
      // an actual value, don't generate any rules.
      if (value === null) return

      return [decl('transition-duration', value)]
    })

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

  functionalUtility('ease', {
    themeKeys: ['--transition-timing-function'],
    handle: (value) => [decl('transition-timing-function', value)],
  })

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

  functionalUtility('leading', {
    themeKeys: ['--line-height'],
    handle: (value) => [decl('line-height', value)],
  })

  functionalUtility('tracking', {
    supportsNegative: true,
    themeKeys: ['--letter-spacing'],
    handle: (value) => [decl('letter-spacing', value)],
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
      return atRoot([property('--tw-outline-style', 'solid', '<custom-ident>')])
    }

    staticUtility('outline-none', [
      ['outline', '2px solid transparent'],
      ['outline-offset', '2px'],
    ])

    /**
     * @css `outline-style`
     */
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
      if (candidate.negative) return

      if (candidate.value === null) {
        return [
          outlineProperties(),
          decl('outline-style', 'var(--tw-outline-style)'),
          decl('outline-width', '1px'),
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
        let value = theme.resolve(candidate.value.value, ['--outline-width'])
        if (value) {
          return [
            outlineProperties(),
            decl('outline-style', 'var(--tw-outline-style)'),
            decl('outline-width', value),
          ]
        } else if (!Number.isNaN(Number(candidate.value.value))) {
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
        modifierThemeKeys: ['--opacity'],
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
        if (Number.isNaN(Number(value))) return null
        return `${value}px`
      },
      handle: (value) => [decl('outline-offset', value)],
    })

    suggest('outline-offset', () => [
      {
        values: ['0', '1', '2', '4', '8'],
        valueThemeKeys: ['--outline-offset'],
      },
    ])
  }

  functionalUtility('opacity', {
    themeKeys: ['--opacity'],
    handleBareValue: ({ value }) => {
      if (Number.isNaN(Number(value))) return null
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
      if (Number.isNaN(Number(value))) return null
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
    if (candidate.negative || !candidate.value) return

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
                : theme.resolve(candidate.modifier.value, ['--line-height'])

            if (modifier) {
              return [decl('font-size', value), decl('line-height', modifier)]
            }
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
        ['--font-size'],
        ['--line-height', '--letter-spacing', '--font-weight'],
      )
      if (value) {
        let [fontSize, options = {}] = Array.isArray(value) ? value : [value]

        if (candidate.modifier) {
          let modifier =
            candidate.modifier.kind === 'arbitrary'
              ? candidate.modifier.value
              : theme.resolve(candidate.modifier.value, ['--line-height'])

          let declarations = [decl('font-size', fontSize)]
          modifier && declarations.push(decl('line-height', modifier))
          return declarations
        }

        if (typeof options === 'string') {
          return [decl('font-size', fontSize), decl('line-height', options)]
        }

        return [
          decl('font-size', fontSize),
          decl('line-height', options['--line-height']),
          decl('letter-spacing', options['--letter-spacing']),
          decl('font-weight', options['--font-weight']),
        ]
      }
    }
  })

  suggest('text', () => [
    {
      values: ['current', 'inherit', 'transparent'],
      valueThemeKeys: ['--text-color', '--color'],
      modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
      modifierThemeKeys: ['--opacity'],
    },
    {
      values: [],
      valueThemeKeys: ['--font-size'],
      modifiers: [],
      modifierThemeKeys: ['--line-height'],
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
        property('--tw-shadow-colored', nullShadow),
        property('--tw-inset-shadow', nullShadow),
        property('--tw-inset-shadow-colored', nullShadow),
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

    utilities.functional('shadow', (candidate) => {
      if (candidate.negative) return

      if (!candidate.value) {
        let value = theme.get(['--shadow'])
        if (value === null) return

        return [
          boxShadowProperties(),
          decl('--tw-shadow', value),
          decl('--tw-shadow-colored', replaceShadowColors(value, 'var(--tw-shadow-color)')),
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
              decl('--tw-shadow-color', value),
              decl('--tw-shadow', 'var(--tw-shadow-colored)'),
            ]
          }
          default: {
            return [
              boxShadowProperties(),
              decl('--tw-shadow', value),
              decl('--tw-shadow-colored', replaceShadowColors(value, 'var(--tw-shadow-color)')),
              decl('box-shadow', cssBoxShadowValue),
            ]
          }
        }
      }

      switch (candidate.value.value) {
        case 'none':
          return [
            boxShadowProperties(),
            decl('--tw-shadow', nullShadow),
            decl('--tw-shadow-colored', nullShadow),
            decl('box-shadow', cssBoxShadowValue),
          ]
      }

      // Shadow size
      {
        let value = theme.get([`--shadow-${candidate.value.value}`])
        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-shadow', value),
            decl('--tw-shadow-colored', replaceShadowColors(value, 'var(--tw-shadow-color)')),
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
            decl('--tw-shadow-color', value),
            decl('--tw-shadow', 'var(--tw-shadow-colored)'),
          ]
        }
      }
    })

    suggest('shadow', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--box-shadow-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
        modifierThemeKeys: ['--opacity'],
      },
      {
        values: [],
        valueThemeKeys: ['--shadow'],
        hasDefaultValue: true,
      },
    ])

    utilities.functional('inset-shadow', (candidate) => {
      if (candidate.negative) return

      if (!candidate.value) {
        let value = theme.get(['--inset-shadow'])
        if (value === null) return

        return [
          boxShadowProperties(),
          decl('--tw-inset-shadow', value),
          decl(
            '--tw-inset-shadow-colored',
            replaceShadowColors(value, 'var(--tw-inset-shadow-color)'),
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
              decl('--tw-inset-shadow-color', value),
              decl('--tw-inset-shadow', 'var(--tw-inset-shadow-colored)'),
            ]
          }
          default: {
            return [
              boxShadowProperties(),
              decl('--tw-inset-shadow', `inset ${value}`),
              decl(
                '--tw-inset-shadow-colored',
                replaceShadowColors(`inset ${value}`, 'var(--tw-inset-shadow-color)'),
              ),
              decl('box-shadow', cssBoxShadowValue),
            ]
          }
        }
      }

      switch (candidate.value.value) {
        case 'none':
          return [
            boxShadowProperties(),
            decl('--tw-inset-shadow', nullShadow),
            decl('--tw-inset-shadow-colored', nullShadow),
            decl('box-shadow', cssBoxShadowValue),
          ]
      }

      // Shadow size
      {
        let value = theme.get([`--inset-shadow-${candidate.value.value}`])

        if (value) {
          return [
            boxShadowProperties(),
            decl('--tw-inset-shadow', value),
            decl(
              '--tw-inset-shadow-colored',
              replaceShadowColors(value, 'var(--tw-inset-shadow-color)'),
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
            decl('--tw-inset-shadow-color', value),
            decl('--tw-inset-shadow', 'var(--tw-inset-shadow-colored)'),
          ]
        }
      }
    })

    suggest('inset-shadow', () => [
      {
        values: ['current', 'inherit', 'transparent'],
        valueThemeKeys: ['--box-shadow-color', '--color'],
        modifiers: Array.from({ length: 21 }, (_, index) => `${index * 5}`),
        modifierThemeKeys: ['--opacity'],
      },
      {
        values: [],
        valueThemeKeys: ['--shadow'],
        hasDefaultValue: true,
      },
    ])

    staticUtility('ring-inset', [boxShadowProperties, ['--tw-ring-inset', 'inset']])

    let defaultRingColor = theme.get(['--default-ring-color']) ?? 'currentColor'
    function ringShadowValue(value: string) {
      return `var(--tw-ring-inset,) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color, ${defaultRingColor})`
    }
    utilities.functional('ring', (candidate) => {
      if (candidate.negative) return

      if (!candidate.value) {
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
        let value = theme.resolve(candidate.value.value, ['--ring-width'])
        if (value === null && !Number.isNaN(Number(candidate.value.value))) {
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
        modifierThemeKeys: ['--opacity'],
      },
      {
        values: ['0', '1', '2', '4', '8'],
        valueThemeKeys: ['--ring-width'],
        hasDefaultValue: true,
      },
    ])

    function insetRingShadowValue(value: string) {
      return `inset 0 0 0 ${value} var(--tw-inset-ring-color, currentColor)`
    }
    utilities.functional('inset-ring', (candidate) => {
      if (candidate.negative) return

      if (!candidate.value) {
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
        let value = theme.resolve(candidate.value.value, ['--ring-width'])
        if (value === null && !Number.isNaN(Number(candidate.value.value))) {
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
        modifierThemeKeys: ['--opacity'],
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
      if (candidate.negative || !candidate.value) return

      if (candidate.value.kind === 'arbitrary') {
        let value: string | null = candidate.value.value
        let type = candidate.value.dataType ?? inferDataType(value, ['color', 'length'])

        switch (type) {
          case 'length': {
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
          return [
            decl('--tw-ring-offset-width', value),
            decl('--tw-ring-offset-shadow', ringOffsetShadowValue),
          ]
        } else if (!Number.isNaN(Number(candidate.value.value))) {
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
      modifierThemeKeys: ['--opacity'],
    },
    {
      values: ['0', '1', '2', '4', '8'],
      valueThemeKeys: ['--ring-offset-width'],
    },
  ])

  utilities.functional('@container', (candidate) => {
    if (candidate.negative) return

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
      hasDefaultValue: false,
    },
  ])

  return utilities
}
