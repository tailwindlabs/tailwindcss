import SelectorParser from 'postcss-selector-parser'
import type { Config } from 'tailwindcss'
import { parseCandidate, type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { isPositiveInteger } from '../../../../tailwindcss/src/utils/infer-data-type'
import { printCandidate } from '../candidates'

export function modernizeArbitraryValues(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    for (let variant of variants(clone)) {
      // Expecting an arbitrary variant
      if (variant.kind !== 'arbitrary') continue

      // Expecting a non-relative arbitrary variant
      if (variant.relative) continue

      let ast = SelectorParser().astSync(variant.selector)

      // Expecting a single selector node
      if (ast.nodes.length !== 1) continue

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

      // Expecting a pseudo selector
      if (target.type === 'pseudo') {
        let targetNode = target
        let compoundNot = false
        if (target.value === ':not') {
          compoundNot = true
          if (target.nodes.length !== 1) continue
          if (target.nodes[0].type !== 'selector') continue
          if (target.nodes[0].nodes.length !== 1) continue
          if (target.nodes[0].nodes[0].type !== 'pseudo') continue

          targetNode = target.nodes[0].nodes[0]
        }

        let newVariant = ((value) => {
          if (value === ':first-child') return 'first'
          else if (value === ':last-child') return 'last'
          else if (value === ':only-child') return 'only'
          else if (value === ':first-of-type') return 'first-of-type'
          else if (value === ':last-of-type') return 'last-of-type'
          else if (value === ':only-of-type') return 'only-of-type'
          else if (
            value === ':nth-child' &&
            targetNode.nodes.length === 1 &&
            targetNode.nodes[0].nodes.length === 1 &&
            targetNode.nodes[0].nodes[0].type === 'tag'
          ) {
            let tag = targetNode.nodes[0].nodes[0]
            if (!isPositiveInteger(tag.value)) {
              if (tag.value === 'odd') {
                if (compoundNot) {
                  compoundNot = false
                  return 'even'
                }
                return 'odd'
              }
              if (tag.value === 'even') {
                if (compoundNot) {
                  compoundNot = false
                  return 'odd'
                }
                return 'even'
              }
              return null
            }

            return `nth-${tag.value}`
          }

          return null
        })(targetNode.value)

        if (newVariant === null) continue

        // Add `not-` prefix
        if (compoundNot) newVariant = `not-${newVariant}`

        let parsed = designSystem.parseVariant(newVariant)
        if (parsed === null) continue

        // Update original variant
        changed = true
        Object.assign(variant, parsed)
      }

      // Expecting an attribute selector
      else if (target.type === 'attribute') {
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
      }
    }

    return changed ? printCandidate(designSystem, clone) : rawCandidate
  }

  return rawCandidate
}

function* variants(candidate: Candidate) {
  function* inner(variant: Variant): Iterable<Variant> {
    yield variant

    if (variant.kind === 'compound') {
      yield* inner(variant.variant)
    }
  }

  for (let variant of candidate.variants) {
    yield* inner(variant)
  }
}
