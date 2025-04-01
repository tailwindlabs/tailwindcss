import SelectorParser from 'postcss-selector-parser'
import { parseCandidate, type Candidate, type Variant } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { isPositiveInteger } from '../../../../tailwindcss/src/utils/infer-data-type'
import { printCandidate } from './candidates'

function memcpy<T extends object, U extends object | null>(target: T, source: U): U {
  // Clear out the target object, otherwise inspecting the final object will
  // look very confusing.
  for (let key in target) delete target[key]

  return Object.assign(target, source)
}

export function migrateModernizeArbitraryValues(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    let clone = structuredClone(candidate)
    let changed = false

    for (let [variant, parent] of variants(clone)) {
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
          memcpy(
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
          memcpy(
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
          memcpy(variant, designSystem.parseVariant('*'))
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
          memcpy(variant, designSystem.parseVariant('**'))
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
          memcpy(variant, designSystem.parseVariant(`in-[${ast.toString()}]`))
          continue
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
            //
            if (value === ':first-letter') return 'first-letter'
            else if (value === ':first-line') return 'first-line'
            //
            else if (value === ':file-selector-button') return 'file'
            else if (value === ':placeholder') return 'placeholder'
            else if (value === ':backdrop') return 'backdrop'
            // Positional
            else if (value === ':first-child') return 'first'
            else if (value === ':last-child') return 'last'
            else if (value === ':only-child') return 'only'
            else if (value === ':first-of-type') return 'first-of-type'
            else if (value === ':last-of-type') return 'last-of-type'
            else if (value === ':only-of-type') return 'only-of-type'
            // State
            else if (value === ':visited') return 'visited'
            else if (value === ':target') return 'target'
            // Forms
            else if (value === ':default') return 'default'
            else if (value === ':checked') return 'checked'
            else if (value === ':indeterminate') return 'indeterminate'
            else if (value === ':placeholder-shown') return 'placeholder-shown'
            else if (value === ':autofill') return 'autofill'
            else if (value === ':optional') return 'optional'
            else if (value === ':required') return 'required'
            else if (value === ':valid') return 'valid'
            else if (value === ':invalid') return 'invalid'
            else if (value === ':in-range') return 'in-range'
            else if (value === ':out-of-range') return 'out-of-range'
            else if (value === ':read-only') return 'read-only'
            // Content
            else if (value === ':empty') return 'empty'
            // Interactive
            else if (value === ':focus-within') return 'focus-within'
            else if (value === ':focus') return 'focus'
            else if (value === ':focus-visible') return 'focus-visible'
            else if (value === ':active') return 'active'
            else if (value === ':enabled') return 'enabled'
            else if (value === ':disabled') return 'disabled'
            //
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

            return null
          })(targetNode.value)

          if (newVariant === null) continue

          // Add `not-` prefix
          if (compoundNot) newVariant = `not-${newVariant}`

          let parsed = designSystem.parseVariant(newVariant)
          if (parsed === null) continue

          // Update original variant
          changed = true
          memcpy(variant, parsed)
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
            memcpy(variant, {
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
            memcpy(variant, {
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
