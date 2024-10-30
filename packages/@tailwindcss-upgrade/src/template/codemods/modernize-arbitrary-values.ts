import SelectorParser from 'postcss-selector-parser'
import type { Config } from 'tailwindcss'
import { parseCandidate, type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

export function modernizeArbitraryValues(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    for (let [variant, parent] of variants(clone)) {
      // Expecting an arbitrary variant
      if (variant.kind !== 'arbitrary') continue

      // Expecting a non-relative arbitrary variant
      if (variant.relative) continue

      let ast = SelectorParser().astSync(variant.selector)

      // Expecting a single selector node
      if (ast.nodes.length !== 1) continue

      // Track whether we need to add a `*:` variant
      let addChildVariant = false

      // Handling a child combinator. E.g.: `[&>[data-visible]]` => `*:data-visible`
      if (
        // Only top-level, so `has-[&>[data-visible]]` is not supported
        parent === null &&
        // [&_>_[data-visible]]:flex
        //  ^ ^ ^^^^^^^^^^^^^^
        ast.nodes[0].length === 3 &&
        ast.nodes[0].nodes[0].type === 'nesting' &&
        ast.nodes[0].nodes[0].value === '&' &&
        ast.nodes[0].nodes[1].type === 'combinator' &&
        ast.nodes[0].nodes[1].value === '>' &&
        ast.nodes[0].nodes[2].type === 'attribute'
      ) {
        ast.nodes[0].nodes = [ast.nodes[0].nodes[2]]
        addChildVariant = true
      }

      // Filter out `&`. E.g.: `&[data-foo]` => `[data-foo]`
      let selectorNodes = ast.nodes[0].filter((node) => node.type !== 'nesting')

      // Expecting a single selector (normal selector or attribute selector)
      if (selectorNodes.length !== 1) continue

      let target = selectorNodes[0]
      if (target.type === 'pseudo' && target.value === ':is') {
        // Expecting a single selector node
        if (target.nodes.length !== 1) continue

        // Expecting a single attribute selector
        if (target.nodes[0].nodes.length !== 1) continue

        // Unwrap the selector from inside `&:is(…)`
        target = target.nodes[0].nodes[0]
      }

      // Expecting an attribute selector
      if (target.type !== 'attribute') continue

      // Attribute selectors
      let attributeKey = target.attribute
      let attributeValue = target.value
        ? target.quoted
          ? `${target.quoteMark}${target.value}${target.quoteMark}`
          : target.value
        : null

      // Insensitive attribute selectors. E.g.: `[data-foo="value" i]`
      //                                                           ^
      if (target.insensitive && attributeValue) {
        attributeValue += ' i'
      }

      let operator = target.operator ?? '='

      // Migrate `data-*`
      if (attributeKey.startsWith('data-')) {
        changed = true
        attributeKey = attributeKey.slice(5) // Remove `data-`
        Object.assign(variant, {
          kind: 'functional',
          root: 'data',
          modifier: null,
          value:
            attributeValue === null
              ? { kind: 'named', value: attributeKey }
              : { kind: 'arbitrary', value: `${attributeKey}${operator}${attributeValue}` },
        } satisfies Variant)
      }

      // Migrate `aria-*`
      else if (attributeKey.startsWith('aria-')) {
        changed = true
        attributeKey = attributeKey.slice(5) // Remove `aria-`
        Object.assign(variant, {
          kind: 'functional',
          root: 'aria',
          modifier: null,
          value:
            attributeValue === null
              ? { kind: 'arbitrary', value: attributeKey } // aria-[foo]
              : operator === '=' && target.value === 'true' && !target.insensitive
                ? { kind: 'named', value: attributeKey } // aria-[foo="true"] or aria-[foo='true'] or aria-[foo=true]
                : { kind: 'arbitrary', value: `${attributeKey}${operator}${attributeValue}` }, // aria-[foo~="true"], aria-[foo|="true"], …
        } satisfies Variant)
      }

      if (addChildVariant) {
        let idx = clone.variants.indexOf(variant)
        if (idx === -1) continue

        // Ensure we have the `*:` variant
        clone.variants.splice(idx, 1, variant, { kind: 'static', root: '*' })
      }
    }

    return changed ? printCandidate(designSystem, clone) : rawCandidate
  }

  return rawCandidate
}

function* variants(candidate: Candidate) {
  function* inner(
    variant: Variant,
    parent: Extract<Variant, { kind: 'compound' }> | null = null,
  ): Iterable<[Variant, Extract<Variant, { kind: 'compound' }> | null]> {
    yield [variant, parent]

    if (variant.kind === 'compound') {
      yield* inner(variant.variant, variant)
    }
  }

  for (let variant of candidate.variants) {
    yield* inner(variant, null)
  }
}
