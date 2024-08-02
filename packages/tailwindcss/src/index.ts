import { version } from '../package.json'
import {
  WalkAction,
  comment,
  decl,
  objectToAst,
  rule,
  toCss,
  walk,
  type AstNode,
  type CssInJs,
  type Rule,
} from './ast'
import type { Candidate } from './candidate'
import { compileCandidates } from './compile'
import * as CSS from './css-parser'
import { buildDesignSystem, type DesignSystem } from './design-system'
import { Theme } from './theme'
import { withAlpha, withNegative } from './utilities'
import { inferDataType } from './utils/infer-data-type'
import { segment } from './utils/segment'

const IS_VALID_UTILITY_NAME = /^[a-z][a-zA-Z0-9/%._-]*$/

type PluginAPI = {
  addVariant(name: string, variant: string | string[] | CssInJs): void
  addUtilities(utilities: Record<string, CssInJs>, options?: {}): void
  matchUtilities(
    utilities: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs>,
    options?: Partial<{
      type: string | string[]

      supportsNegativeValues: boolean

      values: Record<string, string>
      modifiers: 'any' | Record<string, string>
    }>,
  ): void
}

type Plugin = (api: PluginAPI) => void

type CompileOptions = {
  loadPlugin?: (path: string) => Plugin
}

function throwOnPlugin(): never {
  throw new Error('No `loadPlugin` function provided to `compile`')
}

function parseThemeOptions(selector: string) {
  let isReference = false
  let isInline = false

  for (let option of segment(selector.slice(6) /* '@theme'.length */, ' ')) {
    if (option === 'reference') {
      isReference = true
    } else if (option === 'inline') {
      isInline = true
    }
  }

  return { isReference, isInline }
}

export function compile(
  css: string,
  { loadPlugin = throwOnPlugin }: CompileOptions = {},
): {
  build(candidates: string[]): string
} {
  let ast = CSS.parse(css)

  if (process.env.NODE_ENV !== 'test') {
    ast.unshift(comment(`! tailwindcss v${version} | MIT License | https://tailwindcss.com `))
  }

  // Track all invalid candidates
  let invalidCandidates = new Set<string>()
  function onInvalidCandidate(candidate: string) {
    invalidCandidates.add(candidate)
  }

  // Find all `@theme` declarations
  let theme = new Theme()
  let plugins: Plugin[] = []
  let customVariants: ((designSystem: DesignSystem) => void)[] = []
  let customUtilities: ((designSystem: DesignSystem) => void)[] = []
  let firstThemeRule: Rule | null = null
  let keyframesRules: Rule[] = []

  walk(ast, (node, { parent, replaceWith }) => {
    if (node.kind !== 'rule') return

    // Collect paths from `@plugin` at-rules
    if (node.selector.startsWith('@plugin ')) {
      plugins.push(loadPlugin(node.selector.slice(9, -1)))
      replaceWith([])
      return
    }

    // Collect custom `@utility` at-rules
    if (node.selector.startsWith('@utility ')) {
      let name = node.selector.slice(9).trim()

      if (!IS_VALID_UTILITY_NAME.test(name)) {
        throw new Error(
          `\`@utility ${name}\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter.`,
        )
      }

      if (node.nodes.length === 0) {
        throw new Error(
          `\`@utility ${name}\` is empty. Utilities should include at least one property.`,
        )
      }

      customUtilities.push((designSystem) => {
        designSystem.utilities.static(name, (candidate) => {
          if (candidate.negative) return
          return structuredClone(node.nodes)
        })
      })

      replaceWith([])
      return
    }

    // Register custom variants from `@variant` at-rules
    if (node.selector.startsWith('@variant ')) {
      if (parent !== null) {
        throw new Error('`@variant` cannot be nested.')
      }

      // Remove `@variant` at-rule so it's not included in the compiled CSS
      replaceWith([])

      let [name, selector] = segment(node.selector.slice(9), ' ')

      if (node.nodes.length > 0 && selector) {
        throw new Error(`\`@variant ${name}\` cannot have both a selector and a body.`)
      }

      // Variants with a selector, but without a body, e.g.: `@variant hocus (&:hover, &:focus);`
      if (node.nodes.length === 0) {
        if (!selector) {
          throw new Error(`\`@variant ${name}\` has no selector or body.`)
        }

        let selectors = segment(selector.slice(1, -1), ',')

        customVariants.push((designSystem) => {
          designSystem.variants.static(name, (r) => {
            r.nodes = selectors.map((selector) => rule(selector, r.nodes))
          })
        })

        return
      }

      // Variants without a selector, but with a body:
      //
      // E.g.:
      //
      // ```css
      // @variant hocus {
      //   &:hover {
      //     @slot;
      //   }
      //
      //   &:focus {
      //     @slot;
      //   }
      // }
      // ```
      else {
        customVariants.push((designSystem) => {
          designSystem.variants.fromAst(name, node.nodes)
        })

        return
      }
    }

    // Drop instances of `@media theme(…)`
    //
    // We support `@import "tailwindcss/theme" theme(reference)` as a way to
    // import an external theme file as a reference, which becomes `@media
    // theme(reference) { … }` when the `@import` is processed.
    if (node.selector.startsWith('@media theme(')) {
      let themeParams = node.selector.slice(13, -1)

      walk(node.nodes, (child) => {
        if (child.kind !== 'rule') {
          throw new Error(
            'Files imported with `@import "…" theme(…)` must only contain `@theme` blocks.',
          )
        }
        if (child.selector === '@theme') {
          child.selector = '@theme ' + themeParams
          return WalkAction.Skip
        }
      })
      replaceWith(node.nodes)
      return WalkAction.Skip
    }

    if (node.selector !== '@theme' && !node.selector.startsWith('@theme ')) return

    let { isReference, isInline } = parseThemeOptions(node.selector)

    // Record all custom properties in the `@theme` declaration
    walk(node.nodes, (child, { replaceWith }) => {
      // Collect `@keyframes` rules to re-insert with theme variables later,
      // since the `@theme` rule itself will be removed.
      if (child.kind === 'rule' && child.selector.startsWith('@keyframes ')) {
        keyframesRules.push(child)
        replaceWith([])
        return WalkAction.Skip
      }

      if (child.kind === 'comment') return
      if (child.kind === 'declaration' && child.property.startsWith('--')) {
        theme.add(child.property, child.value, { isReference, isInline })
        return
      }

      let snippet = toCss([rule(node.selector, [child])])
        .split('\n')
        .map((line, idx, all) => `${idx === 0 || idx >= all.length - 2 ? ' ' : '>'} ${line}`)
        .join('\n')

      throw new Error(
        `\`@theme\` blocks must only contain custom properties or \`@keyframes\`.\n\n${snippet}`,
      )
    })

    // Keep a reference to the first `@theme` rule to update with the full theme
    // later, and delete any other `@theme` rules.
    if (!firstThemeRule && !isReference) {
      firstThemeRule = node
    } else {
      replaceWith([])
    }
    return WalkAction.Skip
  })

  // Output final set of theme variables at the position of the first `@theme`
  // rule.
  if (firstThemeRule) {
    firstThemeRule = firstThemeRule as Rule
    firstThemeRule.selector = ':root'

    let nodes = []

    for (let [key, value] of theme.entries()) {
      if (value.isReference) continue
      nodes.push(decl(key, value.value))
    }

    if (keyframesRules.length > 0) {
      let animationParts = [...theme.namespace('--animate').values()].flatMap((animation) =>
        animation.split(' '),
      )

      for (let keyframesRule of keyframesRules) {
        // Remove any keyframes that aren't used by an animation variable.
        let keyframesName = keyframesRule.selector.slice(11) // `@keyframes `.length
        if (!animationParts.includes(keyframesName)) {
          continue
        }

        // Wrap `@keyframes` in `@at-root` so they are hoisted out of `:root`
        // when printing.
        nodes.push(
          Object.assign(keyframesRule, {
            selector: '@at-root',
            nodes: [rule(keyframesRule.selector, keyframesRule.nodes)],
          }),
        )
      }
    }
    firstThemeRule.nodes = nodes
  }

  let designSystem = buildDesignSystem(theme)

  for (let customVariant of customVariants) {
    customVariant(designSystem)
  }

  for (let customUtility of customUtilities) {
    customUtility(designSystem)
  }

  let api: PluginAPI = {
    addVariant(name, variant) {
      // Single selector
      if (typeof variant === 'string') {
        designSystem.variants.static(name, (r) => {
          r.nodes = [rule(variant, r.nodes)]
        })
      }

      // Multiple parallel selectors
      else if (Array.isArray(variant)) {
        designSystem.variants.static(name, (r) => {
          r.nodes = variant.map((selector) => rule(selector, r.nodes))
        })
      }

      // CSS-in-JS object
      else if (typeof variant === 'object') {
        designSystem.variants.fromAst(name, objectToAst(variant))
      }
    },

    addUtilities(utilities) {
      for (let [name, css] of Object.entries(utilities)) {
        if (name[0] !== '.' || !IS_VALID_UTILITY_NAME.test(name.slice(1))) {
          throw new Error(
            `\`addUtilities({ '${name}' : … })\` defines an invalid utility selector. Utilities are a single class that is alphanumeric and starts with a lowercase letter.`,
          )
        }

        designSystem.utilities.static(name.slice(1), (candidate) => {
          if (candidate.negative) return

          return objectToAst(css)
        })
      }
    },

    matchUtilities(utilities, options) {
      type Resolvable =
        | Extract<Candidate, { kind: 'functional' }>['value']
        | Extract<Candidate, { kind: 'functional' }>['modifier']

      let invalid = Symbol('invalid')

      let types = options?.type
        ? Array.isArray(options?.type)
          ? options.type
          : [options.type]
        : []

      function resolve(
        item: Resolvable,
        list: 'any' | Record<string, any> | null,
        resolveBare: ((value: string) => string | null) | null,
      ) {
        if (!item) {
          if (list && typeof list === 'object' && list.DEFAULT) {
            return list.DEFAULT
          }

          // Falsy values are invalid
          return null
        }

        // Arbitrary values and modifiers are also used as-is
        if (item.kind === 'arbitrary') return item.value

        // In the case of modifiers: 'any' the value we're passed can be used as-is
        if (list === 'any') return item.value

        // There's no list of valid, named values so this is invalid
        if (!list) return null

        // If the value isn't in the list:
        if (!(item.value in list)) {
          // And bare "values" (modifiers?) are supported then try to use that
          if (resolveBare) {
            if (Number.isNaN(Number(item.value))) {
              return invalid
            }

            return resolveBare(item.value) ?? invalid
          }

          // Otherwise it is invalid
          return invalid
        }

        // Otherwise we'll return the value supplied by list
        // - `options.values`
        // - `options.modifiers`
        return list[item.value]
      }

      for (let [name, fn] of Object.entries(utilities)) {
        if (!IS_VALID_UTILITY_NAME.test(name)) {
          throw new Error(
            `\`matchUtilities({ '${name}' : … })\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter.`,
          )
        }

        designSystem.utilities.functional(name, (candidate) => {
          // Any negative candiate without support is invalid
          if (!options?.supportsNegativeValues && candidate.negative) return

          // If this utility supports color values — try resolving as a color
          let modifiers = options?.modifiers ?? null

          if (types.includes('color')) {
            // Colors implicitly support modifiers when no modifiers are provided
            // They're read from the opacity scale'
            if (!modifiers) {
              modifiers = Object.fromEntries(theme.namespace('--opacity').entries())
            }
          }

          if (candidate.modifier && !modifiers) return

          let modifier = resolve(candidate.modifier, modifiers, (value) => {
            if (!types.includes('color')) return null
            return `${value}%`
          })

          if (modifier === invalid) return

          let value = resolve(
            candidate.value,
            {
              inherit: 'inherit',
              transparent: 'transparent',
              current: 'currentColor',
              ...(options?.values ?? null),
            },
            null,
          )

          if (!value) return
          if (value === invalid) return

          if (types.includes('color') && modifier) {
            value = withAlpha(value, modifier)
          }

          // Throw out any candidate whose value isn't not of a support type
          if (candidate.value?.kind === 'arbitrary' && types.length > 0 && !types.includes('any')) {
            // Bail when the candidate has an explicit data type but it's not in
            // the list of supported types by this utility For example, given a
            // `scrollbar` utility that is used to change its color:
            // scrollbar-[length:var(--whatever)]
            if (candidate.value.dataType && !types.includes(candidate.value.dataType)) {
              return
            }

            // We also need to bail when the candidate does not have an explicit
            // type and we're not able to infer it as one of the supported types.
            if (
              !candidate.value.dataType &&
              !inferDataType(candidate.value.value, types as any[])
            ) {
              return
            }
          }

          if (candidate.negative) {
            value = withNegative(value, candidate)
          }

          return objectToAst(fn(value, { modifier }))
        })
      }
    },
  }

  for (let plugin of plugins) {
    plugin(api)
  }

  let tailwindUtilitiesNode: Rule | null = null

  // Find `@tailwind utilities` and replace it with the actual generated utility
  // class CSS.
  walk(ast, (node) => {
    if (node.kind === 'rule' && node.selector === '@tailwind utilities') {
      tailwindUtilitiesNode = node

      // Stop walking after finding `@tailwind utilities` to avoid walking all
      // of the generated CSS. This means `@tailwind utilities` can only appear
      // once per file but that's the intended usage at this point in time.
      return WalkAction.Stop
    }
  })

  // Replace `@apply` rules with the actual utility classes.
  if (css.includes('@apply')) {
    walk(ast, (node, { replaceWith }) => {
      if (node.kind === 'rule' && node.selector[0] === '@' && node.selector.startsWith('@apply')) {
        let candidates = node.selector
          .slice(7 /* Ignore `@apply ` when parsing the selector */)
          .trim()
          .split(/\s+/g)

        // Replace the `@apply` rule with the actual utility classes
        {
          // Parse the candidates to an AST that we can replace the `@apply` rule with.
          let candidateAst = compileCandidates(candidates, designSystem, {
            onInvalidCandidate: (candidate) => {
              throw new Error(`Cannot apply unknown utility class: ${candidate}`)
            },
          }).astNodes

          // Collect the nodes to insert in place of the `@apply` rule. When a
          // rule was used, we want to insert its children instead of the rule
          // because we don't want the wrapping selector.
          let newNodes: AstNode[] = []
          for (let candidateNode of candidateAst) {
            if (candidateNode.kind === 'rule' && candidateNode.selector[0] !== '@') {
              for (let child of candidateNode.nodes) {
                newNodes.push(child)
              }
            } else {
              newNodes.push(candidateNode)
            }
          }

          replaceWith(newNodes)
        }
      }
    })
  }

  // Track all valid candidates, these are the incoming `rawCandidate` that
  // resulted in a generated AST Node. All the other `rawCandidates` are invalid
  // and should be ignored.
  let allValidCandidates = new Set<string>()
  let compiledCss = toCss(ast)
  let previousAstNodeCount = 0

  return {
    build(newRawCandidates: string[]) {
      let didChange = false

      // Add all new candidates unless we know that they are invalid.
      let prevSize = allValidCandidates.size
      for (let candidate of newRawCandidates) {
        if (!invalidCandidates.has(candidate)) {
          allValidCandidates.add(candidate)
          didChange ||= allValidCandidates.size !== prevSize
        }
      }

      // If no new candidates were added, we can return the original CSS. This
      // currently assumes that we only add new candidates and never remove any.
      if (!didChange) {
        return compiledCss
      }

      if (tailwindUtilitiesNode) {
        let newNodes = compileCandidates(allValidCandidates, designSystem, {
          onInvalidCandidate,
        }).astNodes

        // If no new ast nodes were generated, then we can return the original
        // CSS. This currently assumes that we only add new ast nodes and never
        // remove any.
        if (previousAstNodeCount === newNodes.length) {
          return compiledCss
        }

        previousAstNodeCount = newNodes.length

        tailwindUtilitiesNode.nodes = newNodes
        compiledCss = toCss(ast)
      }

      return compiledCss
    },
  }
}

export function __unstable__loadDesignSystem(css: string) {
  // Find all `@theme` declarations
  let theme = new Theme()
  let ast = CSS.parse(css)

  walk(ast, (node) => {
    if (node.kind !== 'rule') return
    if (node.selector !== '@theme' && !node.selector.startsWith('@theme ')) return
    let { isReference, isInline } = parseThemeOptions(node.selector)

    // Record all custom properties in the `@theme` declaration
    walk([node], (node) => {
      if (node.kind !== 'declaration') return
      if (!node.property.startsWith('--')) return

      theme.add(node.property, node.value, { isReference, isInline })
    })
  })

  return buildDesignSystem(theme)
}
