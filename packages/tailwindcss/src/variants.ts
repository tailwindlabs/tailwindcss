import { decl, rule, type Rule } from './ast'
import { type Variant } from './candidate'
import type { Theme } from './theme'
import { DefaultMap } from './utils/default-map'

type VariantFn<T extends Variant['kind']> = (
  rule: Rule,
  variant: Extract<Variant, { kind: T }>,
) => null | void

type CompareFn = (a: Variant, z: Variant) => number

export class Variants {
  private compareFns = new Map<number, CompareFn>()
  private variants = new Map<
    string,
    {
      kind: Variant['kind']
      order: number
      applyFn: VariantFn<any>
      compounds: boolean
    }
  >()

  private completions = new Map<string, () => string[]>()

  /**
   * Registering a group of variants should result in the same sort number for
   * all the variants. This is to ensure that the variants are applied in the
   * correct order.
   */
  private groupOrder: null | number = null

  /**
   * Keep track of the last sort order instead of using the size of the map to
   * avoid unnecessarily skipping order numbers.
   */
  private lastOrder = 0

  static(name: string, applyFn: VariantFn<'static'>, { compounds }: { compounds?: boolean } = {}) {
    this.set(name, { kind: 'static', applyFn, compounds: compounds ?? true })
  }

  functional(
    name: string,
    applyFn: VariantFn<'functional'>,
    { compounds }: { compounds?: boolean } = {},
  ) {
    this.set(name, { kind: 'functional', applyFn, compounds: compounds ?? true })
  }

  compound(
    name: string,
    applyFn: VariantFn<'compound'>,
    { compounds }: { compounds?: boolean } = {},
  ) {
    this.set(name, { kind: 'compound', applyFn, compounds: compounds ?? true })
  }

  group(fn: () => void, compareFn?: CompareFn) {
    this.groupOrder = this.nextOrder()
    if (compareFn) this.compareFns.set(this.groupOrder, compareFn)
    fn()
    this.groupOrder = null
  }

  has(name: string) {
    return this.variants.has(name)
  }

  get(name: string) {
    return this.variants.get(name)
  }

  kind(name: string) {
    return this.variants.get(name)?.kind!
  }

  compounds(name: string) {
    return this.variants.get(name)?.compounds!
  }

  suggest(name: string, suggestions: () => string[]) {
    this.completions.set(name, suggestions)
  }

  getCompletions(name: string) {
    return this.completions.get(name)?.() ?? []
  }

  compare(a: Variant | null, z: Variant | null): number {
    if (a === z) return 0
    if (a === null) return -1
    if (z === null) return 1

    if (a.kind === 'arbitrary' && z.kind === 'arbitrary') {
      return a.selector < z.selector ? -1 : 1
    } else if (a.kind === 'arbitrary') {
      return 1
    } else if (z.kind === 'arbitrary') {
      return -1
    }

    let aOrder = this.variants.get(a.root)!.order
    let zOrder = this.variants.get(z.root)!.order

    let orderedByVariant = aOrder - zOrder
    if (orderedByVariant !== 0) return orderedByVariant

    if (a.kind === 'compound' && z.kind === 'compound') {
      return this.compare(a.variant, z.variant)
    }

    let compareFn = this.compareFns.get(aOrder)
    if (compareFn === undefined) return 0

    return compareFn(a, z) || (a.root < z.root ? -1 : 1)
  }

  keys() {
    return this.variants.keys()
  }

  entries() {
    return this.variants.entries()
  }

  private set<T extends Variant['kind']>(
    name: string,
    { kind, applyFn, compounds }: { kind: T; applyFn: VariantFn<T>; compounds: boolean },
  ) {
    // In test mode, throw an error if we accidentally override another variant
    // by mistake when implementing a new variant that shares the same root
    // without realizing the definitions need to be merged.
    if (process.env.NODE_ENV === 'test') {
      if (this.variants.has(name)) {
        throw new Error(`Duplicate variant prefix [${name}]`)
      }
    }

    this.lastOrder = this.nextOrder()
    this.variants.set(name, {
      kind,
      applyFn,
      order: this.lastOrder,
      compounds,
    })
  }

  private nextOrder() {
    return this.groupOrder ?? this.lastOrder + 1
  }
}

export function createVariants(theme: Theme): Variants {
  // In the future we may want to support returning a rule here if some complex
  // variant requires it. For now pure mutation is sufficient and will be the
  // most performant.
  let variants = new Variants()

  /**
   * Register a static variant like `hover`.
   */
  function staticVariant(
    name: string,
    selectors: string[],
    { compounds }: { compounds?: boolean } = {},
  ) {
    variants.static(
      name,
      (r) => {
        r.nodes = selectors.map((selector) => rule(selector, r.nodes))
      },
      { compounds },
    )
  }

  variants.static('force', () => {}, { compounds: false })
  staticVariant('*', ['& > *'], { compounds: false })

  variants.compound('not', (ruleNode) => {
    ruleNode.selector = `&:not(${ruleNode.selector.replace('&', '*')})`
  })

  variants.compound('group', (ruleNode, variant) => {
    // Name the group by appending the modifier to `group` class itself if
    // present.
    let groupSelector = variant.modifier
      ? `:where(.group\\/${variant.modifier.value})`
      : ':where(.group)'

    // For most variants we rely entirely on CSS nesting to build-up the final
    // selector, but there is no way to use CSS nesting to make `&` refer to
    // just the `.group` class the way we'd need to for these variants, so we
    // need to replace it in the selector ourselves.
    ruleNode.selector = ruleNode.selector.replace('&', groupSelector)

    // Use `:where` to make sure the specificity of group variants isn't higher
    // than the specificity of other variants.
    ruleNode.selector = `&:is(${ruleNode.selector} *)`
  })

  variants.suggest('group', () => {
    return Array.from(variants.keys()).filter((name) => {
      return variants.get(name)?.compounds ?? false
    })
  })

  variants.compound('peer', (ruleNode, variant) => {
    // Name the peer by appending the modifier to `peer` class itself if
    // present.
    let peerSelector = variant.modifier
      ? `:where(.peer\\/${variant.modifier.value})`
      : ':where(.peer)'

    // For most variants we rely entirely on CSS nesting to build-up the final
    // selector, but there is no way to use CSS nesting to make `&` refer to
    // just the `.peer` class the way we'd need to for these variants, so we
    // need to replace it in the selector ourselves.
    ruleNode.selector = ruleNode.selector.replace('&', peerSelector)

    // Use `:where` to make sure the specificity of peer variants isn't higher
    // than the specificity of other variants.
    ruleNode.selector = `&:is(${ruleNode.selector} ~ *)`
  })

  variants.suggest('peer', () => {
    return Array.from(variants.keys()).filter((name) => {
      return variants.get(name)?.compounds ?? false
    })
  })

  staticVariant('first-letter', ['&::first-letter'], { compounds: false })
  staticVariant('first-line', ['&::first-line'], { compounds: false })

  // TODO: Remove alpha vars or no?
  staticVariant('marker', ['& *::marker', '&::marker'], { compounds: false })

  staticVariant('selection', ['& *::selection', '&::selection'], { compounds: false })
  staticVariant('file', ['&::file-selector-button'], { compounds: false })
  staticVariant('placeholder', ['&::placeholder'], { compounds: false })
  staticVariant('backdrop', ['&::backdrop'], { compounds: false })

  {
    function contentProperties() {
      return rule('@at-root', [
        rule('@property --tw-content', [
          decl('syntax', '"*"'),
          decl('initial-value', '""'),
          decl('inherits', 'false'),
        ]),
      ])
    }
    variants.static(
      'before',
      (v) => {
        v.nodes = [
          rule('&::before', [
            contentProperties(),
            decl('content', 'var(--tw-content)'),
            ...v.nodes,
          ]),
        ]
      },
      { compounds: false },
    )

    variants.static(
      'after',
      (v) => {
        v.nodes = [
          rule('&::after', [contentProperties(), decl('content', 'var(--tw-content)'), ...v.nodes]),
        ]
      },
      { compounds: false },
    )
  }

  let pseudos: [name: string, selector: string][] = [
    // Positional
    ['first', '&:first-child'],
    ['last', '&:last-child'],
    ['only', '&:only-child'],
    ['odd', '&:nth-child(odd)'],
    ['even', '&:nth-child(even)'],
    ['first-of-type', '&:first-of-type'],
    ['last-of-type', '&:last-of-type'],
    ['only-of-type', '&:only-of-type'],

    // State
    // TODO: Remove alpha vars or no?
    ['visited', '&:visited'],

    ['target', '&:target'],
    ['open', '&:is([open], :popover-open)'],

    // Forms
    ['default', '&:default'],
    ['checked', '&:checked'],
    ['indeterminate', '&:indeterminate'],
    ['placeholder-shown', '&:placeholder-shown'],
    ['autofill', '&:autofill'],
    ['optional', '&:optional'],
    ['required', '&:required'],
    ['valid', '&:valid'],
    ['invalid', '&:invalid'],
    ['in-range', '&:in-range'],
    ['out-of-range', '&:out-of-range'],
    ['read-only', '&:read-only'],

    // Content
    ['empty', '&:empty'],

    // Interactive
    ['focus-within', '&:focus-within'],
    [
      'hover',
      '&:hover',
      // TODO: Update tests for this:
      // v => {
      //   v.nodes = [
      //     rule('@media (hover: hover) and (pointer: fine)', [
      //       rule('&:hover', v.nodes),
      //     ]),
      //   ]
      // }
    ],
    ['focus', '&:focus'],
    ['focus-visible', '&:focus-visible'],
    ['active', '&:active'],
    ['enabled', '&:enabled'],
    ['disabled', '&:disabled'],
  ]

  for (let [key, value] of pseudos) {
    staticVariant(key, [value])
  }

  variants.compound('has', (ruleNode) => {
    ruleNode.selector = `&:has(${ruleNode.selector.replace('&', '*')})`
  })

  variants.suggest('has', () => {
    return Array.from(variants.keys()).filter((name) => {
      return variants.get(name)?.compounds ?? false
    })
  })

  variants.functional('aria', (ruleNode, variant) => {
    if (variant.value === null) return null
    if (variant.value.kind === 'arbitrary') {
      ruleNode.nodes = [rule(`&[aria-${variant.value.value}]`, ruleNode.nodes)]
    } else {
      ruleNode.nodes = [rule(`&[aria-${variant.value.value}="true"]`, ruleNode.nodes)]
    }
  })

  variants.suggest('aria', () => [
    'busy',
    'checked',
    'disabled',
    'expanded',
    'hidden',
    'pressed',
    'readonly',
    'required',
    'selected',
  ])

  variants.functional('data', (ruleNode, variant) => {
    if (variant.value === null) return null

    ruleNode.nodes = [rule(`&[data-${variant.value.value}]`, ruleNode.nodes)]
  })

  variants.functional('nth', (ruleNode, variant) => {
    if (variant.value === null) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && Number.isNaN(Number(variant.value.value))) return null

    ruleNode.nodes = [rule(`&:nth-child(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional('nth-last', (ruleNode, variant) => {
    if (variant.value === null) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && Number.isNaN(Number(variant.value.value))) return null

    ruleNode.nodes = [rule(`&:nth-last-child(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional('nth-of-type', (ruleNode, variant) => {
    if (variant.value === null) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && Number.isNaN(Number(variant.value.value))) return null

    ruleNode.nodes = [rule(`&:nth-of-type(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional('nth-last-of-type', (ruleNode, variant) => {
    if (variant.value === null) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && Number.isNaN(Number(variant.value.value))) return null

    ruleNode.nodes = [rule(`&:nth-last-of-type(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional(
    'supports',
    (ruleNode, variant) => {
      if (variant.value === null) return null

      let value = variant.value.value
      if (value === null) return null

      // When the value starts with `not()`, `selector()`, `font-tech()`, or
      // other functions, we can use the value as-is.
      if (/^[\w-]*\s*\(/.test(value)) {
        // Chrome has a bug where `(condition1)or(condition2)` is not valid, but
        // `(condition1) or (condition2)` is supported.
        let query = value.replace(/\b(and|or|not)\b/g, ' $1 ')

        ruleNode.nodes = [rule(`@supports ${query}`, ruleNode.nodes)]
        return
      }

      // When `supports-[display]` is used as a shorthand, we need to make sure
      // that this becomes a valid CSS supports condition.
      //
      // E.g.: `supports-[display]` -> `@supports (display: var(--tw))`
      if (!value.includes(':')) {
        value = `${value}: var(--tw)`
      }

      // When `supports-[display:flex]` is used, we need to make sure that this
      // becomes a valid CSS supports condition by wrapping it in parens.
      //
      // E.g.: `supports-[display:flex]` -> `@supports (display: flex)`
      //
      // We also have to make sure that we wrap the value in parens if the last
      // character is a paren already for situations where we are testing
      // against a CSS custom property.
      //
      // E.g.: `supports-[display]:flex` -> `@supports (display: var(--tw))`
      if (value[0] !== '(' || value[value.length - 1] !== ')') {
        value = `(${value})`
      }

      ruleNode.nodes = [rule(`@supports ${value}`, ruleNode.nodes)]
    },
    { compounds: false },
  )

  staticVariant('motion-safe', ['@media (prefers-reduced-motion: no-preference)'], {
    compounds: false,
  })
  staticVariant('motion-reduce', ['@media (prefers-reduced-motion: reduce)'], { compounds: false })

  staticVariant('contrast-more', ['@media (prefers-contrast: more)'], { compounds: false })
  staticVariant('contrast-less', ['@media (prefers-contrast: less)'], { compounds: false })

  {
    // Helper to compare variants by their resolved values, this is used by the
    // responsive variants (`sm`, `md`, ...), `min-*`, `max-*` and container
    // queries (`@`).
    function compareBreakpoints(
      a: Variant,
      z: Variant,
      direction: 'asc' | 'desc',
      lookup: { get(v: Variant): string | null },
    ) {
      if (a === z) return 0
      let aValue = lookup.get(a)
      if (aValue === null) return direction === 'asc' ? -1 : 1

      let zValue = lookup.get(z)
      if (zValue === null) return direction === 'asc' ? 1 : -1

      if (aValue === zValue) return 0

      // Assumption: when a `(` exists, we are dealing with a CSS function.
      //
      // E.g.: `calc(100% - 1rem)`
      let aIsCssFunction = aValue.indexOf('(')
      let zIsCssFunction = zValue.indexOf('(')

      let aBucket =
        aIsCssFunction === -1
          ? // No CSS function found, bucket by unit instead
            aValue.replace(/[\d.]+/g, '')
          : // CSS function found, bucket by function name
            aValue.slice(0, aIsCssFunction)

      let zBucket =
        zIsCssFunction === -1
          ? // No CSS function found, bucket by unit
            zValue.replace(/[\d.]+/g, '')
          : // CSS function found, bucket by function name
            zValue.slice(0, zIsCssFunction)

      let order =
        // Compare by bucket name
        (aBucket === zBucket ? 0 : aBucket < zBucket ? -1 : 1) ||
        // If bucket names are the same, compare by value
        (direction === 'asc'
          ? parseInt(aValue) - parseInt(zValue)
          : parseInt(zValue) - parseInt(aValue))

      // If the groups are the same, and the contents are not numbers, the
      // `order` will result in `NaN`. In this case, we want to make sorting
      // stable by falling back to a string comparison.
      //
      // This can happen when using CSS functions such as `calc`.
      //
      // E.g.:
      //
      // - `min-[calc(100%-1rem)]` and `min-[calc(100%-2rem)]`
      // - `@[calc(100%-1rem)]` and `@[calc(100%-2rem)]`
      //
      // In this scenario, we want to alphabetically sort `calc(100%-1rem)` and
      // `calc(100%-2rem)` to make it deterministic.
      if (Number.isNaN(order)) {
        return aValue < zValue ? -1 : 1
      }

      return order
    }

    // Breakpoints
    {
      let breakpoints = theme.namespace('--breakpoint')
      let resolvedBreakpoints = new DefaultMap((variant: Variant) => {
        switch (variant.kind) {
          case 'static': {
            return breakpoints.get(variant.root) ?? null
          }

          case 'functional': {
            if (variant.value === null) return null

            let value: string | null = null

            if (variant.value.kind === 'arbitrary') {
              value = variant.value.value
            } else if (variant.value.kind === 'named') {
              value = theme.resolveValue(variant.value.value, ['--breakpoint'])
            }

            if (!value) return null
            if (value.includes('var(')) return null

            return value
          }
          case 'arbitrary':
          case 'compound':
            return null
        }
      })

      // Max
      variants.group(
        () => {
          variants.functional(
            'max',
            (ruleNode, variant) => {
              let value = resolvedBreakpoints.get(variant)
              if (value === null) return null

              ruleNode.nodes = [rule(`@media (width < ${value})`, ruleNode.nodes)]
            },
            { compounds: false },
          )
        },
        (a, z) => compareBreakpoints(a, z, 'desc', resolvedBreakpoints),
      )

      variants.suggest(
        'max',
        () => Array.from(breakpoints.keys()).filter((key) => key !== null) as string[],
      )

      // Min
      variants.group(
        () => {
          // Registers breakpoint variants like `sm`, `md`, `lg`, etc.
          for (let [key, value] of theme.namespace('--breakpoint')) {
            if (key === null) continue
            variants.static(
              key,
              (ruleNode) => {
                ruleNode.nodes = [rule(`@media (width >= ${value})`, ruleNode.nodes)]
              },
              { compounds: false },
            )
          }

          variants.functional(
            'min',
            (ruleNode, variant) => {
              let value = resolvedBreakpoints.get(variant)
              if (value === null) return null

              ruleNode.nodes = [rule(`@media (width >= ${value})`, ruleNode.nodes)]
            },
            { compounds: false },
          )
        },
        (a, z) => compareBreakpoints(a, z, 'asc', resolvedBreakpoints),
      )

      variants.suggest(
        'min',
        () => Array.from(breakpoints.keys()).filter((key) => key !== null) as string[],
      )
    }

    {
      let widths = theme.namespace('--width')

      // Container queries
      let resolvedWidths = new DefaultMap((variant: Variant) => {
        switch (variant.kind) {
          case 'functional': {
            if (variant.value === null) return null

            let value: string | null = null

            if (variant.value.kind === 'arbitrary') {
              value = variant.value.value
            } else if (variant.value.kind === 'named') {
              value = theme.resolveValue(variant.value.value, ['--width'])
            }

            if (!value) return null
            if (value.includes('var(')) return null

            return value
          }
          case 'static':
          case 'arbitrary':
          case 'compound':
            return null
        }
      })

      variants.group(
        () => {
          variants.functional(
            '@max',
            (ruleNode, variant) => {
              let value = resolvedWidths.get(variant)
              if (value === null) return null

              ruleNode.nodes = [
                rule(
                  variant.modifier
                    ? `@container ${variant.modifier.value} (width < ${value})`
                    : `@container (width < ${value})`,
                  ruleNode.nodes,
                ),
              ]
            },
            { compounds: false },
          )
        },
        (a, z) => compareBreakpoints(a, z, 'desc', resolvedWidths),
      )

      variants.suggest(
        '@max',
        () => Array.from(widths.keys()).filter((key) => key !== null) as string[],
      )

      variants.group(
        () => {
          variants.functional(
            '@',
            (ruleNode, variant) => {
              let value = resolvedWidths.get(variant)
              if (value === null) return null

              ruleNode.nodes = [
                rule(
                  variant.modifier
                    ? `@container ${variant.modifier.value} (width >= ${value})`
                    : `@container (width >= ${value})`,
                  ruleNode.nodes,
                ),
              ]
            },
            { compounds: false },
          )
          variants.functional(
            '@min',
            (ruleNode, variant) => {
              let value = resolvedWidths.get(variant)
              if (value === null) return null

              ruleNode.nodes = [
                rule(
                  variant.modifier
                    ? `@container ${variant.modifier.value} (width >= ${value})`
                    : `@container (width >= ${value})`,
                  ruleNode.nodes,
                ),
              ]
            },
            { compounds: false },
          )
        },
        (a, z) => compareBreakpoints(a, z, 'asc', resolvedWidths),
      )

      variants.suggest(
        '@min',
        () => Array.from(widths.keys()).filter((key) => key !== null) as string[],
      )
    }
  }

  staticVariant('portrait', ['@media (orientation: portrait)'], { compounds: false })
  staticVariant('landscape', ['@media (orientation: landscape)'], { compounds: false })

  staticVariant('ltr', ['&:where([dir="ltr"], [dir="ltr"] *)'])
  staticVariant('rtl', ['&:where([dir="rtl"], [dir="rtl"] *)'])

  staticVariant('dark', ['@media (prefers-color-scheme: dark)'], { compounds: false })

  staticVariant('starting', ['@starting-style'], { compounds: false })

  staticVariant('print', ['@media print'], { compounds: false })

  staticVariant('forced-colors', ['@media (forced-colors: active)'], { compounds: false })

  return variants
}
