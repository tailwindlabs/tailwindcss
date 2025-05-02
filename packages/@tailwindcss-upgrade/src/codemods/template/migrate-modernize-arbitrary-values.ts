import SelectorParser from 'postcss-selector-parser'
import { parseCandidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { isPositiveInteger } from '../../../../tailwindcss/src/utils/infer-data-type'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'
import { replaceObject } from '../../utils/replace-object'
import { walkVariants } from '../../utils/walk-variants'
import { computeVariantSignature } from './signatures'

export function migrateModernizeArbitraryValues(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): string {
  let signatures = computeVariantSignature.get(designSystem)

  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    for (let [variant, parent] of walkVariants(clone)) {
      // Forward modifier from the root to the compound variant
      if (
        variant.kind === 'compound' &&
        (variant.root === 'has' || variant.root === 'not' || variant.root === 'in')
      ) {
        if (variant.modifier !== null) {
          if ('modifier' in variant.variant) {
            variant.variant.modifier = variant.modifier
            variant.modifier = null
          }
        }
      }

      // Promote `group-[]:flex` to `in-[.group]:flex`
      //                ^^ Yes, this is empty
      // Promote `group-[]/name:flex` to `in-[.group\/name]:flex`
      if (
        variant.kind === 'compound' &&
        variant.root === 'group' &&
        variant.variant.kind === 'arbitrary' &&
        variant.variant.selector === '&'
      ) {
        // `group-[]`
        if (variant.modifier === null) {
          changed = true
          replaceObject(
            variant,
            designSystem.parseVariant(
              designSystem.theme.prefix
                ? `in-[.${designSystem.theme.prefix}\\:group]`
                : 'in-[.group]',
            ),
          )
        }

        // `group-[]/name`
        else if (variant.modifier.kind === 'named') {
          changed = true
          replaceObject(
            variant,
            designSystem.parseVariant(
              designSystem.theme.prefix
                ? `in-[.${designSystem.theme.prefix}\\:group\\/${variant.modifier.value}]`
                : `in-[.group\\/${variant.modifier.value}]`,
            ),
          )
        }
        continue
      }

      // Expecting an arbitrary variant
      if (variant.kind === 'arbitrary') {
        // Expecting a non-relative arbitrary variant
        if (variant.relative) continue

        let ast = SelectorParser().astSync(variant.selector)

        // Expecting a single selector node
        if (ast.nodes.length !== 1) continue

        // `[&>*]` can be replaced with `*`
        if (
          // Only top-level, so `has-[&>*]` is not supported
          parent === null &&
          // [&_>_*]:flex
          //  ^ ^ ^
          ast.nodes[0].length === 3 &&
          ast.nodes[0].nodes[0].type === 'nesting' &&
          ast.nodes[0].nodes[0].value === '&' &&
          ast.nodes[0].nodes[1].type === 'combinator' &&
          ast.nodes[0].nodes[1].value === '>' &&
          ast.nodes[0].nodes[2].type === 'universal'
        ) {
          changed = true
          replaceObject(variant, designSystem.parseVariant('*'))
          continue
        }

        // `[&_*]` can be replaced with `**`
        if (
          // Only top-level, so `has-[&_*]` is not supported
          parent === null &&
          // [&_*]:flex
          //  ^ ^
          ast.nodes[0].length === 3 &&
          ast.nodes[0].nodes[0].type === 'nesting' &&
          ast.nodes[0].nodes[0].value === '&' &&
          ast.nodes[0].nodes[1].type === 'combinator' &&
          ast.nodes[0].nodes[1].value === ' ' &&
          ast.nodes[0].nodes[2].type === 'universal'
        ) {
          changed = true
          replaceObject(variant, designSystem.parseVariant('**'))
          continue
        }

        // `in-*` variant. If the selector ends with ` &`, we can convert it to an
        // `in-*` variant.
        //
        // E.g.: `[[data-visible]_&]` => `in-data-visible`
        if (
          // Only top-level, so `in-[&_[data-visible]]` is not supported
          parent === null &&
          // [[data-visible]___&]:flex
          //  ^^^^^^^^^^^^^^ ^ ^
          ast.nodes[0].nodes.length === 3 &&
          ast.nodes[0].nodes[1].type === 'combinator' &&
          ast.nodes[0].nodes[1].value === ' ' &&
          ast.nodes[0].nodes[2].type === 'nesting'
        ) {
          ast.nodes[0].nodes.pop() // Remove the nesting node
          ast.nodes[0].nodes.pop() // Remove the combinator

          changed = true
          // When handling a compound like `in-[[data-visible]]`, we will first
          // handle `[[data-visible]]`, then the parent `in-*` part. This means
          // that we can convert `[[data-visible]_&]` to `in-[[data-visible]]`.
          //
          // Later this gets converted to `in-data-visible`.
          replaceObject(variant, designSystem.parseVariant(`in-[${ast.toString()}]`))
          continue
        }

        // Hoist `not` modifier for `@media` or `@supports` variants
        //
        // E.g.: `[@media_not_(scripting:none)]:` -> `not-[@media_(scripting:none)]:`
        if (
          // Only top-level, so something like `in-[@media(scripting:none)]`
          // (which is not valid anyway) is not supported
          parent === null &&
          // [@media_not(scripting:none)]:flex
          //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^
          ast.nodes[0].nodes[0].type === 'tag' &&
          (ast.nodes[0].nodes[0].value.startsWith('@media') ||
            ast.nodes[0].nodes[0].value.startsWith('@supports'))
        ) {
          let targetSignature = signatures.get(designSystem.printVariant(variant))
          let parsed = ValueParser.parse(ast.nodes[0].toString().trim())
          let containsNot = false
          ValueParser.walk(parsed, (node, { replaceWith }) => {
            if (node.kind === 'word' && node.value === 'not') {
              containsNot = true
              replaceWith([])
            }
          })

          // Remove unnecessary whitespace
          parsed = ValueParser.parse(ValueParser.toCss(parsed))
          ValueParser.walk(parsed, (node) => {
            if (node.kind === 'separator' && node.value !== ' ' && node.value.trim() === '') {
              // node.value contains at least 2 spaces. Normalize it to a single
              // space.
              node.value = ' '
            }
          })

          if (containsNot) {
            let hoistedNot = designSystem.parseVariant(`not-[${ValueParser.toCss(parsed)}]`)
            if (hoistedNot === null) continue
            let hoistedNotSignature = signatures.get(designSystem.printVariant(hoistedNot))
            if (targetSignature === hoistedNotSignature) {
              changed = true
              replaceObject(variant, hoistedNot)
              continue
            }
          }
        }

        let prefixedVariant: Variant | null = null

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
          prefixedVariant = designSystem.parseVariant('*')
        }

        // Handling a grand child combinator. E.g.: `[&_[data-visible]]` => `**:data-visible`
        if (
          // Only top-level, so `has-[&_[data-visible]]` is not supported
          parent === null &&
          // [&_[data-visible]]:flex
          //  ^ ^^^^^^^^^^^^^^
          ast.nodes[0].length === 3 &&
          ast.nodes[0].nodes[0].type === 'nesting' &&
          ast.nodes[0].nodes[0].value === '&' &&
          ast.nodes[0].nodes[1].type === 'combinator' &&
          ast.nodes[0].nodes[1].value === ' ' &&
          ast.nodes[0].nodes[2].type === 'attribute'
        ) {
          ast.nodes[0].nodes = [ast.nodes[0].nodes[2]]
          prefixedVariant = designSystem.parseVariant('**')
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
            if (
              value === ':nth-child' &&
              targetNode.nodes.length === 1 &&
              targetNode.nodes[0].nodes.length === 1 &&
              targetNode.nodes[0].nodes[0].type === 'tag' &&
              targetNode.nodes[0].nodes[0].value === 'odd'
            ) {
              if (compoundNot) {
                compoundNot = false
                return 'even'
              }
              return 'odd'
            }
            if (
              value === ':nth-child' &&
              targetNode.nodes.length === 1 &&
              targetNode.nodes[0].nodes.length === 1 &&
              targetNode.nodes[0].nodes[0].type === 'tag' &&
              targetNode.nodes[0].nodes[0].value === 'even'
            ) {
              if (compoundNot) {
                compoundNot = false
                return 'odd'
              }
              return 'even'
            }

            for (let [selector, variantName] of [
              [':nth-child', 'nth'],
              [':nth-last-child', 'nth-last'],
              [':nth-of-type', 'nth-of-type'],
              [':nth-last-of-type', 'nth-of-last-type'],
            ]) {
              if (value === selector && targetNode.nodes.length === 1) {
                if (
                  targetNode.nodes[0].nodes.length === 1 &&
                  targetNode.nodes[0].nodes[0].type === 'tag' &&
                  isPositiveInteger(targetNode.nodes[0].nodes[0].value)
                ) {
                  return `${variantName}-${targetNode.nodes[0].nodes[0].value}`
                }

                return `${variantName}-[${targetNode.nodes[0].toString()}]`
              }
            }

            // Hoist `not` modifier
            if (compoundNot) {
              let targetSignature = signatures.get(designSystem.printVariant(variant))
              let replacementSignature = signatures.get(`not-[${value}]`)
              if (targetSignature === replacementSignature) {
                return `[&${value}]`
              }
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
          replaceObject(variant, structuredClone(parsed))
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
            replaceObject(variant, {
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
            replaceObject(variant, {
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

        if (prefixedVariant) {
          let idx = clone.variants.indexOf(variant)
          if (idx === -1) continue

          // Ensure we inject the prefixed variant
          clone.variants.splice(idx, 1, variant, prefixedVariant)
        }
      }
    }

    return changed ? designSystem.printCandidate(clone) : rawCandidate
  }

  return rawCandidate
}
