import { Features, transform } from 'lightningcss'
import { version } from '../package.json'
import { WalkAction, comment, decl, rule, toCss, walk, type AstNode, type Rule } from './ast'
import { compileCandidates } from './compile'
import * as CSS from './css-parser'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

export function compile(css: string, rawCandidates: string[]) {
  let ast = CSS.parse(css)

  if (process.env.NODE_ENV !== 'test') {
    ast.unshift(comment(`! tailwindcss v${version} | MIT License | https://tailwindcss.com `))
  }

  // Find all `@theme` declarations
  let theme = new Theme()
  let firstThemeRule: Rule | null = null
  let keyframesRules: Rule[] = []

  walk(ast, (node, { replaceWith }) => {
    if (node.kind !== 'rule') return
    if (node.selector !== '@theme') return

    // Record all custom properties in the `@theme` declaration
    walk(node.nodes, (node, { replaceWith }) => {
      // Collect `@keyframes` rules to re-insert with theme variables later,
      // since the `@theme` rule itself will be removed.
      if (node.kind === 'rule' && node.selector.startsWith('@keyframes ')) {
        keyframesRules.push(node)
        replaceWith([])
        return WalkAction.Skip
      }

      if (node.kind === 'comment') return
      if (node.kind === 'declaration' && node.property.startsWith('--')) {
        theme.add(node.property, node.value)
        return
      }

      let snippet = toCss([rule('@theme', [node])])
        .split('\n')
        .map((line, idx, all) => `${idx === 0 || idx >= all.length - 2 ? ' ' : '>'} ${line}`)
        .join('\n')

      throw new Error(
        `\`@theme\` blocks must only contain custom properties or \`@keyframes\`.\n\n${snippet}`,
      )
    })

    // Keep a reference to the first `@theme` rule to update with the full theme
    // later, and delete any other `@theme` rules.
    if (!firstThemeRule) {
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
      nodes.push(decl(key, value))
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

  // Find `@tailwind utilities` and replace it with the actual generated utility
  // class CSS.
  walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'rule' && node.selector === '@tailwind utilities') {
      replaceWith(compileCandidates(rawCandidates, designSystem).astNodes)
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
            throwOnInvalidCandidate: true,
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

  // Drop instances of `@media reference`
  //
  // We allow importing a theme as a reference so users can define the theme for
  // the current CSS file without duplicating the theme vars in the final CSS.
  // This is useful for users who use `@apply` in Vue SFCs and in CSS modules.
  //
  // The syntax is derived from `@import "tailwindcss/theme" reference` which
  // turns into `@media reference { … }` in the final CSS.
  if (css.includes('@media reference')) {
    walk(ast, (node, { replaceWith }) => {
      if (node.kind === 'rule' && node.selector === '@media reference') {
        replaceWith([])
        return WalkAction.Skip
      }
    })
  }

  return toCss(ast)
}

export function optimizeCss(
  input: string,
  { file = 'input.css', minify = false }: { file?: string; minify?: boolean } = {},
) {
  return transform({
    filename: file,
    code: Buffer.from(input),
    minify,
    sourceMap: false,
    drafts: {
      customMedia: true,
    },
    nonStandard: {
      deepSelectorCombinator: true,
    },
    include: Features.Nesting,
    exclude: Features.LogicalProperties,
    targets: {
      safari: (16 << 16) | (4 << 8),
    },
    errorRecovery: true,
  }).code.toString()
}

export function __unstable__loadDesignSystem(css: string) {
  // Find all `@theme` declarations
  let theme = new Theme()
  let ast = CSS.parse(css)

  walk(ast, (node) => {
    if (node.kind !== 'rule') return
    if (node.selector !== '@theme') return

    // Record all custom properties in the `@theme` declaration
    walk([node], (node) => {
      if (node.kind !== 'declaration') return
      if (!node.property.startsWith('--')) return

      theme.add(node.property, node.value)
    })
  })

  return buildDesignSystem(theme)
}
