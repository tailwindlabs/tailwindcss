import { version } from '../package.json'
import { WalkAction, comment, decl, rule, toCss, walk, type AstNode, type Rule } from './ast'
import { compileCandidates } from './compile'
import * as CSS from './css-parser'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'
import { isSimpleClassSelector } from './utils/is-simple-class-selector'

export function compile(css: string): {
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

  // Track `@apply` information
  let containsAtApply = css.includes('@apply')
  let userDefinedApplyables = new Map<string, AstNode[]>()

  // Find all `@theme` declarations
  let theme = new Theme()
  let firstThemeRule: Rule | null = null
  let keyframesRules: Rule[] = []

  walk(ast, (node, { replaceWith }) => {
    if (node.kind !== 'rule') return

    // Track all user-defined classes for `@apply` support
    if (
      containsAtApply &&
      // Verify that it is a valid applyable-class. An applyable class is a
      // class that is a very simple selector, like `.foo` or `.bar`, but doesn't
      // contain any spaces, combinators, pseudo-selectors, pseudo-elements, or
      // attribute selectors.
      node.selector[0] === '.' &&
      isSimpleClassSelector(node.selector)
    ) {
      // Convert the class `.foo` into a candidate `foo`
      let candidate = node.selector.slice(1)

      // It could be that multiple definitions exist for the same class, so we
      // need to track all of them.
      let nodes = userDefinedApplyables.get(candidate) ?? []

      // Add all children of the current rule to the list of nodes for the
      // current candidate.
      for (let child of node.nodes) {
        nodes.push(child)
      }

      // Store the list of nodes for the current candidate
      userDefinedApplyables.set(candidate, nodes)
    }

    // Drop instances of `@media reference`
    //
    // We support `@import "tailwindcss/theme" reference` as a way to import an external theme file
    // as a reference, which becomes `@media reference { … }` when the `@import` is processed.
    if (node.selector === '@media reference') {
      walk(node.nodes, (child) => {
        if (child.kind !== 'rule') {
          throw new Error(
            'Files imported with `@import "…" reference` must only contain `@theme` blocks.',
          )
        }
        if (child.selector === '@theme') {
          child.selector = '@theme reference'
          return WalkAction.Skip
        }
      })
      replaceWith(node.nodes)
    }

    if (node.selector !== '@theme' && node.selector !== '@theme reference') return

    let isReference = node.selector === '@theme reference'

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
        theme.add(child.property, child.value, isReference)
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
  if (containsAtApply) {
    walk(ast, (root) => {
      if (root.kind !== 'rule') return WalkAction.Continue

      // It's possible to `@apply` user-defined classes. We need to make sure
      // that we never run into a situation where we are eventually applying
      // the same class that we are currently processing otherwise we will end
      // up in an infinite loop (circular dependency).
      //
      // This means that we need to track the current node as a candidate and
      // error when we encounter it again.
      let rootAsCandidate = root.selector.slice(1)

      walk(root.nodes, (node, { replaceWith }) => {
        if (
          node.kind === 'rule' &&
          node.selector[0] === '@' &&
          node.selector.startsWith('@apply')
        ) {
          let candidates = node.selector
            .slice(7 /* Ignore `@apply ` when parsing the selector */)
            .trim()
            .split(/\s+/g)

          // Replace the `@apply` rule with the actual utility classes
          {
            let newNodes: AstNode[] = []

            // Collect all user-defined classes for the current candidates that
            // we need to apply.
            for (let candidate of candidates) {
              // If the candidate is the same as the current node we are
              // processing, we have a circular dependency.
              if (candidate === rootAsCandidate) {
                throw new Error(
                  `You cannot \`@apply\` the \`${candidate}\` utility here because it creates a circular dependency.`,
                )
              }

              let nodes = userDefinedApplyables.get(candidate)
              if (!nodes) continue

              for (let child of nodes) {
                newNodes.push(structuredClone(child))
              }
            }

            // Parse the candidates to an AST that we can replace the `@apply`
            // rule with.
            let candidateAst = compileCandidates(candidates, designSystem, {
              onInvalidCandidate: (candidate) => {
                // We must pass in user-defined classes and then filter them out
                // here because, while they are usually not known utilities, the
                // user can define a class that happens to *also* be a known
                // utility.
                //
                // For example, given the following, `flex` counts as both a
                // user-defined class and a known utility:
                //
                // ```css
                // .flex {
                //   --display-mode: flex;
                // }
                // ```
                //
                // When the user then uses `@apply flex`, we want to both apply
                // the user-defined class and the utility class.
                if (userDefinedApplyables.has(candidate)) return

                throw new Error(`Cannot apply unknown utility class: ${candidate}`)
              },
            }).astNodes

            // Collect the nodes to insert in place of the `@apply` rule. When a
            // rule was used, we want to insert its children instead of the rule
            // because we don't want the wrapping selector.
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

      return WalkAction.Skip
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
    if (node.selector !== '@theme' && node.selector !== '@theme reference') return
    let isReference = node.selector === '@theme reference'

    // Record all custom properties in the `@theme` declaration
    walk([node], (node) => {
      if (node.kind !== 'declaration') return
      if (!node.property.startsWith('--')) return

      theme.add(node.property, node.value, isReference)
    })
  })

  return buildDesignSystem(theme)
}
