import {
  WalkAction,
  atRoot,
  atRule,
  decl,
  rule,
  walk,
  type AstNode,
  type AtRule,
  type Rule,
} from './ast'
import { type Variant } from './candidate'
import { parseAtRule } from './css-parser'
import type { Theme } from './theme'
import { DefaultMap } from './utils/default-map'
import { isPositiveInteger } from './utils/infer-data-type'
import { segment } from './utils/segment'

type VariantFn<T extends Variant['kind']> = (
  rule: AtRule | Rule,
  variant: Extract<Variant, { kind: T }>,
) => null | void

type CompareFn = (a: Variant, z: Variant) => number

export const enum Compounds {
  Never = 0,
  AtRules = 1 << 0,
  StyleRules = 1 << 1,
}

export class Variants {
  public compareFns = new Map<number, CompareFn>()
  public variants = new Map<
    string,
    {
      kind: Variant['kind']
      order: number
      applyFn: VariantFn<any>

      // The kind of rules that are allowed in this compound variant
      compoundsWith: Compounds

      // The kind of rules that are generated by this variant
      // Determines whether or not a compound variant can use this variant
      compounds: Compounds
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

  static(
    name: string,
    applyFn: VariantFn<'static'>,
    { compounds, order }: { compounds?: Compounds; order?: number } = {},
  ) {
    this.set(name, {
      kind: 'static',
      applyFn,
      compoundsWith: Compounds.Never,
      compounds: compounds ?? Compounds.StyleRules,
      order,
    })
  }

  fromAst(name: string, ast: AstNode[]) {
    let selectors: string[] = []

    walk(ast, (node) => {
      if (node.kind === 'rule') {
        selectors.push(node.selector)
      } else if (node.kind === 'at-rule' && node.name !== 'slot') {
        selectors.push(`@${node.name} ${node.params}`)
      }
    })

    this.static(
      name,
      (r) => {
        let body = structuredClone(ast)
        substituteAtSlot(body, r.nodes)
        r.nodes = body
      },
      {
        compounds: compoundsForSelectors(selectors),
      },
    )
  }

  functional(
    name: string,
    applyFn: VariantFn<'functional'>,
    { compounds, order }: { compounds?: Compounds; order?: number } = {},
  ) {
    this.set(name, {
      kind: 'functional',
      applyFn,
      compoundsWith: Compounds.Never,
      compounds: compounds ?? Compounds.StyleRules,
      order,
    })
  }

  compound(
    name: string,
    compoundsWith: Compounds,
    applyFn: VariantFn<'compound'>,
    { compounds, order }: { compounds?: Compounds; order?: number } = {},
  ) {
    this.set(name, {
      kind: 'compound',
      applyFn,
      compoundsWith,
      compounds: compounds ?? Compounds.StyleRules,
      order,
    })
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

  compoundsWith(parent: string, child: string | Variant) {
    let parentInfo = this.variants.get(parent)
    let childInfo =
      typeof child === 'string'
        ? this.variants.get(child)
        : child.kind === 'arbitrary'
          ? // This isn't strictly necessary but it'll allow us to bail quickly
            // when parsing candidates
            { compounds: compoundsForSelectors([child.selector]) }
          : this.variants.get(child.root)

    // One of the variants don't exist
    if (!parentInfo || !childInfo) return false

    // The parent variant is not a compound variant
    if (parentInfo.kind !== 'compound') return false

    // The variant `parent` may _compound with_ `child` if `parent` supports the
    // rules that `child` generates. We instead use static registration metadata
    // about what `parent` and `child` support instead of trying to apply the
    // variant at runtime to see if the rules are compatible.

    // The `child` variant cannot compound *ever*
    if (childInfo.compounds === Compounds.Never) return false

    // The `parent` variant cannot compound *ever*
    // This shouldn't ever happen because `kind` is `compound`
    if (parentInfo.compoundsWith === Compounds.Never) return false

    // Any rule that `child` may generate must be supported by `parent`
    if ((parentInfo.compoundsWith & childInfo.compounds) === 0) return false

    return true
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
      let order = this.compare(a.variant, z.variant)
      if (order === 0) {
        if (a.modifier && z.modifier) {
          return a.modifier.value < z.modifier.value ? -1 : 1
        } else if (a.modifier) {
          return 1
        } else if (z.modifier) {
          return -1
        }
      }
      return order
    }

    let compareFn = this.compareFns.get(aOrder)
    if (compareFn === undefined) return a.root < z.root ? -1 : 1
    return compareFn(a, z)
  }

  keys() {
    return this.variants.keys()
  }

  entries() {
    return this.variants.entries()
  }

  private set<T extends Variant['kind']>(
    name: string,
    {
      kind,
      applyFn,
      compounds,
      compoundsWith,
      order,
    }: {
      kind: T
      applyFn: VariantFn<T>
      compoundsWith: Compounds
      compounds: Compounds
      order?: number
    },
  ) {
    let existing = this.variants.get(name)
    if (existing) {
      Object.assign(existing, { kind, applyFn, compounds })
    } else {
      if (order === undefined) {
        this.lastOrder = this.nextOrder()
        order = this.lastOrder
      }
      this.variants.set(name, {
        kind,
        applyFn,
        order,
        compoundsWith,
        compounds,
      })
    }
  }

  private nextOrder() {
    return this.groupOrder ?? this.lastOrder + 1
  }
}

export function compoundsForSelectors(selectors: string[]) {
  let compounds = Compounds.Never

  for (let sel of selectors) {
    if (sel[0] === '@') {
      // Non-conditional at-rules are present so we can't compound
      if (
        !sel.startsWith('@media') &&
        !sel.startsWith('@supports') &&
        !sel.startsWith('@container')
      ) {
        return Compounds.Never
      }

      compounds |= Compounds.AtRules
      continue
    }

    // Pseudo-elements are present so we can't compound
    if (sel.includes('::')) {
      return Compounds.Never
    }

    compounds |= Compounds.StyleRules
  }

  return compounds
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
    { compounds }: { compounds?: Compounds } = {},
  ) {
    compounds = compounds ?? compoundsForSelectors(selectors)

    variants.static(
      name,
      (r) => {
        r.nodes = selectors.map((selector) => {
          if (selector[0] === '@') {
            return parseAtRule(selector, r.nodes)
          } else {
            return rule(selector, r.nodes)
          }
        })
      },
      { compounds },
    )
  }

  variants.static('force', () => {}, { compounds: Compounds.Never })
  staticVariant('*', [':where(& > *)'], { compounds: Compounds.Never })

  function negateConditions(ruleName: string, conditions: string[]) {
    return conditions.map((condition) => {
      condition = condition.trim()

      let parts = segment(condition, ' ')

      // @media not {query}
      // @supports not {query}
      // @container not {query}
      if (parts[0] === 'not') {
        return parts.slice(1).join(' ')
      }

      if (ruleName === 'container') {
        // @container {query}
        if (parts[0][0] === '(') {
          return `not ${condition}`
        }

        // @container {name} not {query}
        else if (parts[1] === 'not') {
          return `${parts[0]} ${parts.slice(2).join(' ')}`
        }

        // @container {name} {query}
        else {
          return `${parts[0]} not ${parts.slice(1).join(' ')}`
        }
      }

      return `not ${condition}`
    })
  }

  let conditionalRules = ['media', 'supports', 'container']

  function negateAtRule(rule: AtRule) {
    for (let ruleName of conditionalRules) {
      if (ruleName !== rule.name) continue

      let conditions = segment(rule.params, ',')

      // We don't support things like `@media screen, print` because
      // the negation would be `@media not screen and print` and we don't
      // want to deal with that complexity.
      if (conditions.length > 1) return null

      conditions = negateConditions(rule.name, conditions)
      return atRule(rule.name, conditions.join(', '))
    }

    return null
  }

  function negateSelector(selector: string) {
    if (selector.includes('::')) return null

    let selectors = segment(selector, ',').map((sel) => {
      // Remove unnecessary wrapping &:is(…) to reduce the selector size
      if (sel.startsWith('&:is(') && sel.endsWith(')')) {
        sel = sel.slice(5, -1)
      }

      // Replace `&` in target variant with `*`, so variants like `&:hover`
      // become `&:not(*:hover)`. The `*` will often be optimized away.
      sel = sel.replaceAll('&', '*')

      return sel
    })

    return `&:not(${selectors.join(', ')})`
  }

  variants.compound('not', Compounds.StyleRules | Compounds.AtRules, (ruleNode, variant) => {
    if (variant.variant.kind === 'arbitrary' && variant.variant.relative) return null

    if (variant.modifier) return null

    let didApply = false

    walk([ruleNode], (node, { path }) => {
      if (node.kind !== 'rule' && node.kind !== 'at-rule') return WalkAction.Continue
      if (node.nodes.length > 0) return WalkAction.Continue

      // Throw out any candidates with variants using nested style rules
      let atRules: AtRule[] = []
      let styleRules: Rule[] = []

      for (let parent of path) {
        if (parent.kind === 'at-rule') {
          atRules.push(parent)
        } else if (parent.kind === 'rule') {
          styleRules.push(parent)
        }
      }

      if (atRules.length > 1) return WalkAction.Stop
      if (styleRules.length > 1) return WalkAction.Stop

      let rules: (Rule | AtRule)[] = []

      for (let node of styleRules) {
        let selector = negateSelector(node.selector)
        if (!selector) {
          didApply = false
          return WalkAction.Stop
        }

        rules.push(rule(selector, []))
      }

      for (let node of atRules) {
        let negatedAtRule = negateAtRule(node)
        if (!negatedAtRule) {
          didApply = false
          return WalkAction.Stop
        }

        rules.push(negatedAtRule)
      }

      Object.assign(ruleNode, rule('&', rules))

      // Track that the variant was actually applied
      didApply = true

      return WalkAction.Skip
    })

    // TODO: Tweak group, peer, has to ignore intermediate `&` selectors (maybe?)
    if (ruleNode.kind === 'rule' && ruleNode.selector === '&' && ruleNode.nodes.length === 1) {
      Object.assign(ruleNode, ruleNode.nodes[0])
    }

    // If the node wasn't modified, this variant is not compatible with
    // `not-*` so discard the candidate.
    if (!didApply) return null
  })

  variants.suggest('not', () => {
    return Array.from(variants.keys()).filter((name) => {
      return variants.compoundsWith('not', name)
    })
  })

  variants.compound('group', Compounds.StyleRules, (ruleNode, variant) => {
    if (variant.variant.kind === 'arbitrary' && variant.variant.relative) return null

    // Name the group by appending the modifier to `group` class itself if
    // present.
    let variantSelector = variant.modifier
      ? `:where(.group\\/${variant.modifier.value})`
      : ':where(.group)'

    let didApply = false

    walk([ruleNode], (node, { path }) => {
      if (node.kind !== 'rule') return WalkAction.Continue

      // Throw out any candidates with variants using nested style rules
      for (let parent of path.slice(0, -1)) {
        if (parent.kind !== 'rule') continue

        didApply = false
        return WalkAction.Stop
      }

      // For most variants we rely entirely on CSS nesting to build-up the final
      // selector, but there is no way to use CSS nesting to make `&` refer to
      // just the `.group` class the way we'd need to for these variants, so we
      // need to replace it in the selector ourselves.
      let selector = node.selector.replaceAll('&', variantSelector)

      // When the selector is a selector _list_ we need to wrap it in `:is`
      // to make sure the matching behavior is consistent with the original
      // variant / selector.
      if (segment(selector, ',').length > 1) {
        selector = `:is(${selector})`
      }

      node.selector = `&:is(${selector} *)`

      // Track that the variant was actually applied
      didApply = true
    })

    // If the node wasn't modified, this variant is not compatible with
    // `group-*` so discard the candidate.
    if (!didApply) return null
  })

  variants.suggest('group', () => {
    return Array.from(variants.keys()).filter((name) => {
      return variants.compoundsWith('group', name)
    })
  })

  variants.compound('peer', Compounds.StyleRules, (ruleNode, variant) => {
    if (variant.variant.kind === 'arbitrary' && variant.variant.relative) return null

    // Name the peer by appending the modifier to `peer` class itself if
    // present.
    let variantSelector = variant.modifier
      ? `:where(.peer\\/${variant.modifier.value})`
      : ':where(.peer)'

    let didApply = false

    walk([ruleNode], (node, { path }) => {
      if (node.kind !== 'rule') return WalkAction.Continue

      // Throw out any candidates with variants using nested style rules
      for (let parent of path.slice(0, -1)) {
        if (parent.kind !== 'rule') continue

        didApply = false
        return WalkAction.Stop
      }

      // For most variants we rely entirely on CSS nesting to build-up the final
      // selector, but there is no way to use CSS nesting to make `&` refer to
      // just the `.group` class the way we'd need to for these variants, so we
      // need to replace it in the selector ourselves.
      let selector = node.selector.replaceAll('&', variantSelector)

      // When the selector is a selector _list_ we need to wrap it in `:is`
      // to make sure the matching behavior is consistent with the original
      // variant / selector.
      if (segment(selector, ',').length > 1) {
        selector = `:is(${selector})`
      }

      node.selector = `&:is(${selector} ~ *)`

      // Track that the variant was actually applied
      didApply = true
    })

    // If the node wasn't modified, this variant is not compatible with
    // `peer-*` so discard the candidate.
    if (!didApply) return null
  })

  variants.suggest('peer', () => {
    return Array.from(variants.keys()).filter((name) => {
      return variants.compoundsWith('peer', name)
    })
  })

  staticVariant('first-letter', ['&::first-letter'])
  staticVariant('first-line', ['&::first-line'])

  // TODO: Remove alpha vars or no?
  staticVariant('marker', ['& *::marker', '&::marker'])

  staticVariant('selection', ['& *::selection', '&::selection'])
  staticVariant('file', ['&::file-selector-button'])
  staticVariant('placeholder', ['&::placeholder'])
  staticVariant('backdrop', ['&::backdrop'])

  {
    function contentProperties() {
      return atRoot([
        atRule('property', '--tw-content', [
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
      { compounds: Compounds.Never },
    )

    variants.static(
      'after',
      (v) => {
        v.nodes = [
          rule('&::after', [contentProperties(), decl('content', 'var(--tw-content)'), ...v.nodes]),
        ]
      },
      { compounds: Compounds.Never },
    )
  }

  // Positional
  staticVariant('first', ['&:first-child'])
  staticVariant('last', ['&:last-child'])
  staticVariant('only', ['&:only-child'])
  staticVariant('odd', ['&:nth-child(odd)'])
  staticVariant('even', ['&:nth-child(even)'])
  staticVariant('first-of-type', ['&:first-of-type'])
  staticVariant('last-of-type', ['&:last-of-type'])
  staticVariant('only-of-type', ['&:only-of-type'])

  // State
  staticVariant('visited', ['&:visited'])
  staticVariant('target', ['&:target'])
  staticVariant('open', ['&:is([open], :popover-open)'])

  // Forms
  staticVariant('default', ['&:default'])
  staticVariant('checked', ['&:checked'])
  staticVariant('indeterminate', ['&:indeterminate'])
  staticVariant('placeholder-shown', ['&:placeholder-shown'])
  staticVariant('autofill', ['&:autofill'])
  staticVariant('optional', ['&:optional'])
  staticVariant('required', ['&:required'])
  staticVariant('valid', ['&:valid'])
  staticVariant('invalid', ['&:invalid'])
  staticVariant('in-range', ['&:in-range'])
  staticVariant('out-of-range', ['&:out-of-range'])
  staticVariant('read-only', ['&:read-only'])

  // Content
  staticVariant('empty', ['&:empty'])

  // Interactive
  staticVariant('focus-within', ['&:focus-within'])
  variants.static('hover', (r) => {
    r.nodes = [rule('&:hover', [atRule('media', '(hover: hover)', r.nodes)])]
  })
  staticVariant('focus', ['&:focus'])
  staticVariant('focus-visible', ['&:focus-visible'])
  staticVariant('active', ['&:active'])
  staticVariant('enabled', ['&:enabled'])
  staticVariant('disabled', ['&:disabled'])

  staticVariant('inert', ['&:is([inert], [inert] *)'])

  variants.compound('has', Compounds.StyleRules, (ruleNode, variant) => {
    if (variant.modifier) return null

    let didApply = false

    walk([ruleNode], (node, { path }) => {
      if (node.kind !== 'rule') return WalkAction.Continue

      // Throw out any candidates with variants using nested style rules
      for (let parent of path.slice(0, -1)) {
        if (parent.kind !== 'rule') continue

        didApply = false
        return WalkAction.Stop
      }

      // Replace `&` in target variant with `*`, so variants like `&:hover`
      // become `&:has(*:hover)`. The `*` will often be optimized away.
      node.selector = `&:has(${node.selector.replaceAll('&', '*')})`

      // Track that the variant was actually applied
      didApply = true
    })

    // If the node wasn't modified, this variant is not compatible with
    // `has-*` so discard the candidate.
    if (!didApply) return null
  })

  variants.suggest('has', () => {
    return Array.from(variants.keys()).filter((name) => {
      return variants.compoundsWith('has', name)
    })
  })

  variants.functional('aria', (ruleNode, variant) => {
    if (!variant.value || variant.modifier) return null

    if (variant.value.kind === 'arbitrary') {
      ruleNode.nodes = [rule(`&[aria-${quoteAttributeValue(variant.value.value)}]`, ruleNode.nodes)]
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
    if (!variant.value || variant.modifier) return null

    ruleNode.nodes = [rule(`&[data-${quoteAttributeValue(variant.value.value)}]`, ruleNode.nodes)]
  })

  variants.functional('nth', (ruleNode, variant) => {
    if (!variant.value || variant.modifier) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && !isPositiveInteger(variant.value.value)) return null

    ruleNode.nodes = [rule(`&:nth-child(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional('nth-last', (ruleNode, variant) => {
    if (!variant.value || variant.modifier) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && !isPositiveInteger(variant.value.value)) return null

    ruleNode.nodes = [rule(`&:nth-last-child(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional('nth-of-type', (ruleNode, variant) => {
    if (!variant.value || variant.modifier) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && !isPositiveInteger(variant.value.value)) return null

    ruleNode.nodes = [rule(`&:nth-of-type(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional('nth-last-of-type', (ruleNode, variant) => {
    if (!variant.value || variant.modifier) return null

    // Only numeric bare values are allowed
    if (variant.value.kind === 'named' && !isPositiveInteger(variant.value.value)) return null

    ruleNode.nodes = [rule(`&:nth-last-of-type(${variant.value.value})`, ruleNode.nodes)]
  })

  variants.functional(
    'supports',
    (ruleNode, variant) => {
      if (!variant.value || variant.modifier) return null

      let value = variant.value.value
      if (value === null) return null

      // When the value starts with `not()`, `selector()`, `font-tech()`, or
      // other functions, we can use the value as-is.
      if (/^[\w-]*\s*\(/.test(value)) {
        // Chrome has a bug where `(condition1)or(condition2)` is not valid, but
        // `(condition1) or (condition2)` is supported.
        let query = value.replace(/\b(and|or|not)\b/g, ' $1 ')

        ruleNode.nodes = [atRule('supports', query, ruleNode.nodes)]
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

      ruleNode.nodes = [atRule('supports', value, ruleNode.nodes)]
    },
    { compounds: Compounds.AtRules },
  )

  staticVariant('motion-safe', ['@media (prefers-reduced-motion: no-preference)'])
  staticVariant('motion-reduce', ['@media (prefers-reduced-motion: reduce)'])

  staticVariant('contrast-more', ['@media (prefers-contrast: more)'])
  staticVariant('contrast-less', ['@media (prefers-contrast: less)'])

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
            return theme.resolveValue(variant.root, ['--breakpoint']) ?? null
          }

          case 'functional': {
            if (!variant.value || variant.modifier) return null

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
              if (variant.modifier) return null
              let value = resolvedBreakpoints.get(variant)
              if (value === null) return null

              ruleNode.nodes = [atRule('media', `(width < ${value})`, ruleNode.nodes)]
            },
            { compounds: Compounds.AtRules },
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
                ruleNode.nodes = [atRule('media', `(width >= ${value})`, ruleNode.nodes)]
              },
              { compounds: Compounds.AtRules },
            )
          }

          variants.functional(
            'min',
            (ruleNode, variant) => {
              if (variant.modifier) return null
              let value = resolvedBreakpoints.get(variant)
              if (value === null) return null

              ruleNode.nodes = [atRule('media', `(width >= ${value})`, ruleNode.nodes)]
            },
            { compounds: Compounds.AtRules },
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
                atRule(
                  'container',
                  variant.modifier
                    ? `${variant.modifier.value} (width < ${value})`
                    : `(width < ${value})`,
                  ruleNode.nodes,
                ),
              ]
            },
            { compounds: Compounds.AtRules },
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
                atRule(
                  'container',
                  variant.modifier
                    ? `${variant.modifier.value} (width >= ${value})`
                    : `(width >= ${value})`,
                  ruleNode.nodes,
                ),
              ]
            },
            { compounds: Compounds.AtRules },
          )
          variants.functional(
            '@min',
            (ruleNode, variant) => {
              let value = resolvedWidths.get(variant)
              if (value === null) return null

              ruleNode.nodes = [
                atRule(
                  'container',
                  variant.modifier
                    ? `${variant.modifier.value} (width >= ${value})`
                    : `(width >= ${value})`,
                  ruleNode.nodes,
                ),
              ]
            },
            { compounds: Compounds.AtRules },
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

  staticVariant('portrait', ['@media (orientation: portrait)'])
  staticVariant('landscape', ['@media (orientation: landscape)'])

  staticVariant('ltr', ['&:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)'])
  staticVariant('rtl', ['&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)'])

  staticVariant('dark', ['@media (prefers-color-scheme: dark)'])

  staticVariant('starting', ['@starting-style'])

  staticVariant('print', ['@media print'])

  staticVariant('forced-colors', ['@media (forced-colors: active)'])

  return variants
}

function quoteAttributeValue(input: string) {
  if (input.includes('=')) {
    let [attribute, ...after] = segment(input, '=')
    let value = after.join('=').trim()

    // If the value is already quoted, skip.
    if (value[0] === "'" || value[0] === '"') {
      return input
    }

    // Handle case sensitivity flags on unescaped values
    if (value.length > 1) {
      let trailingCharacter = value[value.length - 1]
      if (
        value[value.length - 2] === ' ' &&
        (trailingCharacter === 'i' ||
          trailingCharacter === 'I' ||
          trailingCharacter === 's' ||
          trailingCharacter === 'S')
      ) {
        return `${attribute}="${value.slice(0, -2)}" ${trailingCharacter}`
      }
    }

    return `${attribute}="${value}"`
  }

  return input
}

export function substituteAtSlot(ast: AstNode[], nodes: AstNode[]) {
  walk(ast, (node, { replaceWith }) => {
    // Replace `@slot` with rule nodes
    if (node.kind === 'at-rule' && node.name === 'slot') {
      replaceWith(nodes)
    }

    // Wrap `@keyframes` and `@property` in `AtRoot` nodes
    else if (node.kind === 'at-rule' && (node.name === 'keyframes' || node.name === 'property')) {
      Object.assign(node, atRoot([atRule(node.name, node.params, node.nodes)]))
      return WalkAction.Skip
    }
  })
}
