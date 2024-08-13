import { version } from '../package.json'
import { substituteAtApply } from './apply'
import { comment, decl, rule, toCss, walk, WalkAction, type Rule } from './ast'
import { compileCandidates } from './compile'
import * as CSS from './css-parser'
import { buildDesignSystem, type DesignSystem } from './design-system'
import { substituteFunctions, THEME_FUNCTION_INVOCATION } from './functions'
import { registerPlugins, type Plugin } from './plugin-api'
import { Theme } from './theme'
import { segment } from './utils/segment'

const IS_VALID_UTILITY_NAME = /^[a-z][a-zA-Z0-9/%._-]*$/

type CompileOptions = {
  loadPlugin?: (path: string) => Promise<Plugin>
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

async function parseCss(css: string, { loadPlugin = throwOnPlugin }: CompileOptions = {}) {
  let ast = CSS.parse(css)

  // Find all `@theme` declarations
  let theme = new Theme()
  let pluginPaths: string[] = []
  let customVariants: ((designSystem: DesignSystem) => void)[] = []
  let customUtilities: ((designSystem: DesignSystem) => void)[] = []
  let firstThemeRule: Rule | null = null
  let keyframesRules: Rule[] = []
  let globs: string[] = []

  walk(ast, (node, { parent, replaceWith }) => {
    if (node.kind !== 'rule') return

    // Collect paths from `@plugin` at-rules
    if (node.selector === '@plugin' || node.selector.startsWith('@plugin ')) {
      if (node.nodes.length > 0) {
        throw new Error('`@plugin` cannot have a body.')
      }

      if (parent !== null) {
        throw new Error('`@plugin` cannot be nested.')
      }

      pluginPaths.push(node.selector.slice(9, -1))
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

      return
    }

    // Collect paths from `@source` at-rules
    if (node.selector.startsWith('@source ')) {
      if (node.nodes.length > 0) {
        throw new Error('`@source` cannot have a body.')
      }

      if (parent !== null) {
        throw new Error('`@source` cannot be nested.')
      }

      let path = node.selector.slice(8)
      if (
        (path[0] === '"' && path[path.length - 1] !== '"') ||
        (path[0] === "'" && path[path.length - 1] !== "'") ||
        (path[0] !== "'" && path[0] !== '"')
      ) {
        throw new Error('`@source` paths must be quoted.')
      }
      globs.push(path.slice(1, -1))
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

  let plugins = await Promise.all(pluginPaths.map(loadPlugin))

  registerPlugins(plugins, designSystem, ast)

  // Replace `@apply` rules with the actual utility classes.
  if (css.includes('@apply')) {
    substituteAtApply(ast, designSystem)
  }

  // Replace `theme()` function calls with the actual theme variables.
  if (css.includes(THEME_FUNCTION_INVOCATION)) {
    substituteFunctions(ast, designSystem)
  }

  // Remove `@utility`, we couldn't replace it before yet because we had to
  // handle the nested `@apply` at-rules first.
  walk(ast, (node, { replaceWith }) => {
    if (node.kind !== 'rule') return

    if (node.selector[0] === '@' && node.selector.startsWith('@utility ')) {
      replaceWith([])
    }

    // The `@utility` has to be top-level, therefore we don't have to traverse
    // into nested trees.
    return WalkAction.Skip
  })

  return {
    designSystem,
    ast,
    globs,
  }
}

export async function compile(
  css: string,
  opts: CompileOptions = {},
): Promise<{
  globs: string[]
  build(candidates: string[]): string
}> {
  let { designSystem, ast, globs } = await parseCss(css, opts)

  let tailwindUtilitiesNode: Rule | null = null

  // Find `@tailwind utilities` so that we can later replace it with the actual
  // generated utility class CSS.
  walk(ast, (node) => {
    if (node.kind === 'rule' && node.selector === '@tailwind utilities') {
      tailwindUtilitiesNode = node

      // Stop walking after finding `@tailwind utilities` to avoid walking all
      // of the generated CSS. This means `@tailwind utilities` can only appear
      // once per file but that's the intended usage at this point in time.
      return WalkAction.Stop
    }
  })

  if (process.env.NODE_ENV !== 'test') {
    ast.unshift(comment(`! tailwindcss v${version} | MIT License | https://tailwindcss.com `))
  }

  // Track all invalid candidates
  let invalidCandidates = new Set<string>()
  function onInvalidCandidate(candidate: string) {
    invalidCandidates.add(candidate)
  }

  // Track all valid candidates, these are the incoming `rawCandidate` that
  // resulted in a generated AST Node. All the other `rawCandidates` are invalid
  // and should be ignored.
  let allValidCandidates = new Set<string>()
  let compiledCss = toCss(ast)
  let previousAstNodeCount = 0

  return {
    globs,
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

        substituteFunctions(newNodes, designSystem)

        previousAstNodeCount = newNodes.length

        tailwindUtilitiesNode.nodes = newNodes
        compiledCss = toCss(ast)
      }

      return compiledCss
    },
  }
}

export async function __unstable__loadDesignSystem(css: string, opts: CompileOptions = {}) {
  let result = await parseCss(css, opts)
  return result.designSystem
}
