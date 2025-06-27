import { substituteAtApply } from '../../../../tailwindcss/src/apply'
import { atRule, styleRule, toCss, walk, type AstNode } from '../../../../tailwindcss/src/ast'
import { printArbitraryValue } from '../../../../tailwindcss/src/candidate'
import * as SelectorParser from '../../../../tailwindcss/src/compat/selector-parser'
import { CompileAstFlags, type DesignSystem } from '../../../../tailwindcss/src/design-system'
import { ThemeOptions } from '../../../../tailwindcss/src/theme'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { isValidSpacingMultiplier } from '../../../../tailwindcss/src/utils/infer-data-type'
import * as ValueParser from '../../../../tailwindcss/src/value-parser'
import { dimensions } from '../../utils/dimension'

// Given a utility, compute a signature that represents the utility. The
// signature will be a normalised form of the generated CSS for the utility, or
// a unique symbol if the utility is not valid. The class in the selector will
// be replaced with the `.x` selector.
//
// This function should only be passed the base utility so `flex`, `hover:flex`
// and `focus:flex` will all use just `flex`. Variants are handled separately.
//
// E.g.:
//
// | UTILITY          | GENERATED SIGNATURE     |
// | ---------------- | ----------------------- |
// | `[display:flex]` | `.x { display: flex; }` |
// | `flex`           | `.x { display: flex; }` |
//
// These produce the same signature, therefore they represent the same utility.
export const computeUtilitySignature = new DefaultMap<
  DesignSystem,
  DefaultMap<string, string | Symbol>
>((designSystem) => {
  return new DefaultMap<string, string | Symbol>((utility) => {
    try {
      // Ensure the prefix is added to the utility if it is not already present.
      utility =
        designSystem.theme.prefix && !utility.startsWith(designSystem.theme.prefix)
          ? `${designSystem.theme.prefix}:${utility}`
          : utility

      // Use `@apply` to normalize the selector to `.x`
      let ast: AstNode[] = [styleRule('.x', [atRule('@apply', utility)])]

      temporarilyDisableThemeInline(designSystem, () => {
        // There's separate utility caches for respect important vs not
        // so we want to compile them both with `@theme inline` disabled
        for (let candidate of designSystem.parseCandidate(utility)) {
          designSystem.compileAstNodes(candidate, CompileAstFlags.None)
          designSystem.compileAstNodes(candidate, CompileAstFlags.RespectImportant)
        }

        substituteAtApply(ast, designSystem)
      })

      // We will be mutating the AST, so we need to clone it first to not affect
      // the original AST
      ast = structuredClone(ast)

      // Optimize the AST. This is needed such that any internal intermediate
      // nodes are gone. This will also cleanup declaration nodes with undefined
      // values or `--tw-sort` declarations.
      walk(ast, (node, { replaceWith }) => {
        // Optimize declarations
        if (node.kind === 'declaration') {
          if (node.value === undefined || node.property === '--tw-sort') {
            replaceWith([])
          }
        }

        // Replace special nodes with its children
        else if (node.kind === 'context' || node.kind === 'at-root') {
          replaceWith(node.nodes)
        }

        // Remove comments
        else if (node.kind === 'comment') {
          replaceWith([])
        }
      })

      // Resolve theme values to their inlined value.
      //
      // E.g.:
      //
      // `[color:var(--color-red-500)]` → `[color:oklch(63.7%_0.237_25.331)]`
      // `[color:oklch(63.7%_0.237_25.331)]` → `[color:oklch(63.7%_0.237_25.331)]`
      //
      // Due to the `@apply` from above, this will become:
      //
      // ```css
      // .example {
      //   color: oklch(63.7% 0.237 25.331);
      // }
      // ```
      //
      // Which conveniently will be equivalent to: `text-red-500` when we inline
      // the value.
      //
      // Without inlining:
      // ```css
      // .example {
      //   color: var(--color-red-500, oklch(63.7% 0.237 25.331));
      // }
      // ```
      //
      // Inlined:
      // ```css
      // .example {
      //   color: oklch(63.7% 0.237 25.331);
      // }
      // ```
      //
      // Recently we made sure that utilities like `text-red-500` also generate
      // the fallback value for usage in `@reference` mode.
      //
      // The second assumption is that if you use `var(--key, fallback)` that
      // happens to match a known variable _and_ its inlined value. Then we can
      // replace it with the inlined variable. This allows us to handle custom
      // `@theme` and `@theme inline` definitions.
      walk(ast, (node) => {
        // Handle declarations
        if (node.kind === 'declaration' && node.value !== undefined) {
          if (node.value.includes('var(')) {
            let valueAst = ValueParser.parse(node.value)

            let seen = new Set<string>()
            ValueParser.walk(valueAst, (valueNode, { replaceWith }) => {
              if (valueNode.kind !== 'function') return
              if (valueNode.value !== 'var') return

              // Resolve the underlying value of the variable
              if (valueNode.nodes.length !== 1 && valueNode.nodes.length < 3) {
                return
              }

              let variable = valueNode.nodes[0].value

              // Drop the prefix from the variable name if it is present. The
              // internal variable doesn't have the prefix.
              if (
                designSystem.theme.prefix &&
                variable.startsWith(`--${designSystem.theme.prefix}-`)
              ) {
                variable = variable.slice(`--${designSystem.theme.prefix}-`.length)
              }
              let variableValue = designSystem.resolveThemeValue(variable)
              // Prevent infinite recursion when the variable value contains the
              // variable itself.
              if (seen.has(variable)) return
              seen.add(variable)
              if (variableValue === undefined) return // Couldn't resolve the variable

              // Inject variable fallbacks when no fallback is present yet.
              //
              // A fallback could consist of multiple values.
              //
              // E.g.:
              //
              // ```
              // var(--font-sans, ui-sans-serif, system-ui, sans-serif, …)
              // ```
              {
                // More than 1 argument means that a fallback is already present
                if (valueNode.nodes.length === 1) {
                  // Inject the fallback value into the variable lookup
                  valueNode.nodes.push(...ValueParser.parse(`,${variableValue}`))
                }
              }

              // Replace known variable + inlined fallback value with the value
              // itself again
              {
                // We need at least 3 arguments. The variable, the separator and a fallback value.
                if (valueNode.nodes.length >= 3) {
                  let nodeAsString = ValueParser.toCss(valueNode.nodes) // This could include more than just the variable
                  let constructedValue = `${valueNode.nodes[0].value},${variableValue}`
                  if (nodeAsString === constructedValue) {
                    replaceWith(ValueParser.parse(variableValue))
                  }
                }
              }
            })

            // Replace the value with the new value
            node.value = ValueParser.toCss(valueAst)
          }

          // Very basic `calc(…)` constant folding to handle the spacing scale
          // multiplier:
          //
          // Input:  `--spacing(4)`
          //       → `calc(var(--spacing, 0.25rem) * 4)`
          //       → `calc(0.25rem * 4)`       ← this is the case we will see
          //                                     after inlining the variable
          //       → `1rem`
          if (node.value.includes('calc')) {
            let folded = false
            let valueAst = ValueParser.parse(node.value)
            ValueParser.walk(valueAst, (valueNode, { replaceWith }) => {
              if (valueNode.kind !== 'function') return
              if (valueNode.value !== 'calc') return

              // [
              //   { kind: 'word', value: '0.25rem' },            0
              //   { kind: 'separator', value: ' ' },             1
              //   { kind: 'word', value: '*' },                  2
              //   { kind: 'separator', value: ' ' },             3
              //   { kind: 'word', value: '256' }                 4
              // ]
              if (valueNode.nodes.length !== 5) return
              if (valueNode.nodes[2].kind !== 'word' && valueNode.nodes[2].value !== '*') return

              let parsed = dimensions.get(valueNode.nodes[0].value)
              if (parsed === null) return

              let [value, unit] = parsed

              let multiplier = Number(valueNode.nodes[4].value)
              if (Number.isNaN(multiplier)) return

              folded = true
              replaceWith(ValueParser.parse(`${value * multiplier}${unit}`))
            })

            if (folded) {
              node.value = ValueParser.toCss(valueAst)
            }
          }

          // We will normalize the `node.value`, this is the same kind of logic
          // we use when printing arbitrary values. It will remove unnecessary
          // whitespace.
          //
          // Essentially normalizing the `node.value` to a canonical form.
          node.value = printArbitraryValue(node.value)
        }
      })

      // Compute the final signature, by generating the CSS for the utility
      let signature = toCss(ast)
      return signature
    } catch {
      // A unique symbol is returned to ensure that 2 signatures resulting in
      // `null` are not considered equal.
      return Symbol()
    }
  })
})

// For all static utilities in the system, compute a lookup table that maps the
// utility signature to the utility name. This is used to find the utility name
// for a given utility signature.
//
// For all functional utilities, we can compute static-like utilities by
// essentially pre-computing the values and modifiers. This is a bit slow, but
// also only has to happen once per design system.
export const preComputedUtilities = new DefaultMap<DesignSystem, DefaultMap<string, string[]>>(
  (ds) => {
    let signatures = computeUtilitySignature.get(ds)
    let lookup = new DefaultMap<string, string[]>(() => [])

    for (let [className, meta] of ds.getClassList()) {
      let signature = signatures.get(className)
      if (typeof signature !== 'string') continue
      lookup.get(signature).push(className)

      for (let modifier of meta.modifiers) {
        // Modifiers representing numbers can be computed and don't need to be
        // pre-computed. Doing the math and at the time of writing this, this
        // would save you 250k additionally pre-computed utilities...
        if (isValidSpacingMultiplier(modifier)) {
          continue
        }

        let classNameWithModifier = `${className}/${modifier}`
        let signature = signatures.get(classNameWithModifier)
        if (typeof signature !== 'string') continue
        lookup.get(signature).push(classNameWithModifier)
      }
    }

    return lookup
  },
)

// Given a variant, compute a signature that represents the variant. The
// signature will be a normalised form of the generated CSS for the variant, or
// a unique symbol if the variant is not valid. The class in the selector will
// be replaced with `.x`.
//
// E.g.:
//
// | VARIANT          | GENERATED SIGNATURE           |
// | ---------------- | ----------------------------- |
// | `[&:focus]:flex` | `.x:focus { display: flex; }` |
// | `focus:flex`     | `.x:focus { display: flex; }` |
//
// These produce the same signature, therefore they represent the same variant.
export const computeVariantSignature = new DefaultMap<
  DesignSystem,
  DefaultMap<string, string | Symbol>
>((designSystem) => {
  return new DefaultMap<string, string | Symbol>((variant) => {
    try {
      // Ensure the prefix is added to the utility if it is not already present.
      variant =
        designSystem.theme.prefix && !variant.startsWith(designSystem.theme.prefix)
          ? `${designSystem.theme.prefix}:${variant}`
          : variant

      // Use `@apply` to normalize the selector to `.x`
      let ast: AstNode[] = [styleRule('.x', [atRule('@apply', `${variant}:flex`)])]
      substituteAtApply(ast, designSystem)

      // Canonicalize selectors to their minimal form
      walk(ast, (node) => {
        // At-rules
        if (node.kind === 'at-rule' && node.params.includes(' ')) {
          node.params = node.params.replaceAll(' ', '')
        }

        // Style rules
        else if (node.kind === 'rule') {
          let selectorAst = SelectorParser.parse(node.selector)
          let changed = false
          SelectorParser.walk(selectorAst, (node, { replaceWith }) => {
            if (node.kind === 'separator' && node.value !== ' ') {
              node.value = node.value.trim()
              changed = true
            }

            // Remove unnecessary `:is(…)` selectors
            else if (node.kind === 'function' && node.value === ':is') {
              // A single selector inside of `:is(…)` can be replaced with the
              // selector itself.
              //
              // E.g.: `:is(.foo)` → `.foo`
              if (node.nodes.length === 1) {
                changed = true
                replaceWith(node.nodes)
              }

              // A selector with the universal selector `*` followed by a pseudo
              // class, can be replaced with the pseudo class itself.
              else if (
                node.nodes.length === 2 &&
                node.nodes[0].kind === 'selector' &&
                node.nodes[0].value === '*' &&
                node.nodes[1].kind === 'selector' &&
                node.nodes[1].value[0] === ':'
              ) {
                changed = true
                replaceWith(node.nodes[1])
              }
            }

            // Ensure `*` exists before pseudo selectors inside of `:not(…)`,
            // `:where(…)`, …
            //
            // E.g.:
            //
            // `:not(:first-child)` → `:not(*:first-child)`
            //
            else if (
              node.kind === 'function' &&
              node.value[0] === ':' &&
              node.nodes[0]?.kind === 'selector' &&
              node.nodes[0]?.value[0] === ':'
            ) {
              changed = true
              node.nodes.unshift({ kind: 'selector', value: '*' })
            }
          })

          if (changed) {
            node.selector = SelectorParser.toCss(selectorAst)
          }
        }
      })

      // Compute the final signature, by generating the CSS for the variant
      let signature = toCss(ast)
      return signature
    } catch {
      // A unique symbol is returned to ensure that 2 signatures resulting in
      // `null` are not considered equal.
      return Symbol()
    }
  })
})

export const preComputedVariants = new DefaultMap<DesignSystem, DefaultMap<string, string[]>>(
  (designSystem) => {
    let signatures = computeVariantSignature.get(designSystem)
    let lookup = new DefaultMap<string, string[]>(() => [])

    // Actual static variants
    for (let [root, variant] of designSystem.variants.entries()) {
      if (variant.kind === 'static') {
        let signature = signatures.get(root)
        if (typeof signature !== 'string') continue
        lookup.get(signature).push(root)
      }
    }

    return lookup
  },
)

function temporarilyDisableThemeInline<T>(designSystem: DesignSystem, cb: () => T): T {
  // Turn off `@theme inline` feature such that `@theme` and `@theme inline` are
  // considered the same. The biggest motivation for this is referencing
  // variables in another namespace that happen to contain the same value as the
  // utility's own namespaces it is reading from.
  //
  // E.g.:
  //
  // The `max-w-*` utility doesn't read from the `--breakpoint-*` namespace.
  // But it does read from the `--container-*` namespace. It also happens to
  // be the case that `--breakpoint-md` and `--container-3xl` are the exact
  // same value.
  //
  // If you then use the `max-w-(--breakpoint-md)` utility, inlining the
  // variable would mean:
  //  - `max-w-(--breakpoint-md)` → `max-width: 48rem;` → `max-w-3xl`
  //  - `max-w-(--contianer-3xl)` → `max-width: 48rem;` → `max-w-3xl`
  //
  // Not inlining the variable would mean:
  // - `max-w-(--breakpoint-md)` → `max-width: var(--breakpoint-md);` → `max-w-(--breakpoint-md)`
  // - `max-w-(--container-3xl)` → `max-width: var(--container-3xl);` → `max-w-3xl`

  // @ts-expect-error We are monkey-patching a method that's considered private
  // in TypeScript
  let originalGet = designSystem.theme.values.get

  // Track all values with the inline option set, so we can restore them later.
  let restorableInlineOptions = new Set<{ options: ThemeOptions }>()

  // @ts-expect-error We are monkey-patching a method that's considered private
  // in TypeScript
  designSystem.theme.values.get = (key: string) => {
    // @ts-expect-error We are monkey-patching a method that's considered private
    // in TypeScript
    let value = originalGet.call(designSystem.theme.values, key)
    if (value === undefined) return value

    // Remove `inline` if it was set
    if (value.options & ThemeOptions.INLINE) {
      restorableInlineOptions.add(value)
      value.options &= ~ThemeOptions.INLINE
    }

    return value
  }

  try {
    // Run the callback with the `@theme inline` feature disabled
    return cb()
  } finally {
    // Restore the `@theme inline` to the original value
    // @ts-expect-error We are monkey-patching a method that's private
    designSystem.theme.values.get = originalGet

    // Re-add the `inline` option, in case future lookups are done
    for (let value of restorableInlineOptions) {
      value.options |= ThemeOptions.INLINE
    }
  }
}
