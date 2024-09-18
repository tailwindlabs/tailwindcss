import { AtRule, Container, parse, Rule, type Plugin } from 'postcss'
import SelectorParser from 'postcss-selector-parser'
import { format } from 'prettier'

enum WalkAction {
  // Continue walking the tree. Default behavior.
  Continue,

  // Skip walking into the current node.
  Skip,

  // Stop walking the tree entirely.
  Stop,
}

interface Walkable<T> {
  each(cb: (node: T, index: number) => void): void
}

// Custom walk implementation where we can skip going into nodes when we don't
// need to process them.
function walk<T>(rule: Walkable<T>, cb: (rule: T) => void | WalkAction): undefined | false {
  let result: undefined | false = undefined

  rule.each?.((node) => {
    let action = cb(node) ?? WalkAction.Continue
    if (action === WalkAction.Stop) {
      result = false
      return result
    }
    if (action !== WalkAction.Skip) {
      result = walk(node as Walkable<T>, cb)
      return result
    }
  })

  return result
}

export function migrateAtLayerUtilities(): Plugin {
  async function migrate(atRule: AtRule) {
    if (atRule.params !== 'utilities' && atRule.params !== 'components') return

    // Upgrade every Rule in `@layer utilities` to an `@utility` at-rule.
    walk(atRule, (node) => {
      if (!(node instanceof Rule)) return

      // Fan out each utility into its own rule.
      //
      // E.g.:
      // ```css
      // .foo .bar:hover .baz {
      //   color: red;
      // }
      // ```
      //
      // Becomes:
      // ```css
      // @utility foo {
      //   & .bar:hover .baz {
      //     color: red;
      //   }
      // }
      //
      // @utility bar {
      //   .foo &:hover .baz {
      //     color: red;
      //   }
      // }
      //
      // @utility baz {
      //   .foo .bar:hover & {
      //     color: red;
      //   }
      // }
      // ```
      let utilitySelectors: [name: string, selector: string][] = []
      SelectorParser((selectors) => {
        selectors.each((selector) => {
          walk(selector, (node) => {
            // Ignore everything in `:not(…)`
            if (node.type === 'pseudo' && node.value === ':not') {
              return WalkAction.Skip
            }

            // Replace the class with `&` and track the new selector
            if (node.type === 'class') {
              // Work on a clone of the selector, so we can safely manipulate
              // it without affecting the original.
              let clone = selector.clone()

              // Find the node in the clone based on the position of the
              // original node.
              let target = clone.atPosition(node.source!.start!.line, node.source!.start!.column)

              // Keep moving the target to the front until we hit the start or
              // find a combinator. This is to prevent `.foo.bar` from becoming
              // `.bar&`. Instead we want `&.bar`.
              let parent = target.parent!
              let idx = (target.parent?.index(target) ?? 0) - 1
              while (idx >= 0 && parent.at(idx)?.type !== 'combinator') {
                let current = parent.at(idx + 1)
                let previous = parent.at(idx)
                parent.at(idx + 1).replaceWith(previous)
                parent.at(idx).replaceWith(current)

                idx--
              }

              // Replace the class with `&`
              target.replaceWith(SelectorParser.nesting())

              // Track the new selector
              utilitySelectors.push([node.value, clone.toString()])
            }
          })
        })
      }).processSync(node.selector, { updateSelector: false })

      // Wrap the new rules in `@utility` at-rules
      let newRules: AtRule[] = []
      for (let [name, selector] of utilitySelectors) {
        if (selector === '&') {
          newRules.push(new AtRule({ name: 'utility', params: name, nodes: node.nodes }))
        } else {
          newRules.push(
            new AtRule({
              name: 'utility',
              params: name,
              nodes: [new Rule({ selector, nodes: node.nodes })],
            }),
          )
        }
      }

      node.replaceWith(newRules)

      return WalkAction.Skip
    })

    // Hoist all `@utility` at-rules to the top. It could be that these were
    // (deeply) nested in other at-rules like `@media`.
    //
    // ```css
    // @media (min-width: 640px) {
    //   @utility foo {
    //     color: red;
    //   }
    // }
    // ```
    //
    // Becomes:
    // ```css
    // @utility foo {
    //   @media (min-width: 640px) {
    //     color: red;
    //   }
    // }
    // ```
    let trees: AtRule[] = []
    walk(atRule, (node) => {
      if (node.type !== 'atrule' || node.name !== 'utility') return

      // Track the parents of the node, so we can reconstruct the tree later.
      let parents = []
      let parent: Container | null = node.parent ?? null

      while (
        parent &&
        !(
          parent instanceof AtRule &&
          parent.name === 'layer' &&
          (parent.params === 'utilities' || parent.params === 'components')
        )
      ) {
        parents.push(parent.clone({ nodes: [] }))

        // Move up the tree
        // @ts-expect-error
        parent = parent.parent ?? null
      }

      // Work on a clone of the node, so we can safely manipulate it.
      let nodeClone = node.clone()

      // Reconstruct the tree
      for (let parent of parents) {
        let children = nodeClone.nodes ?? []
        // Inject _my_ children into the parent
        parent.append(children)

        // Inject the parent into the node
        nodeClone.removeAll()
        nodeClone.append(parent)
      }

      // Collect the newly new tree (which is the manipulated node)
      trees.push(nodeClone)

      // Already handled the `@utility` at-rule, no need to go deeper.
      return WalkAction.Skip
    })

    // Replace `@layer utilities` with the newly constructed trees.
    //
    // Prettier is used to generate cleaner output, but it's only used on the
    // nodes that we migrated.
    atRule.replaceWith(
      await Promise.all(
        trees.map(async (tree) => {
          return parse(await format(tree.toString(), { parser: 'css', semi: true }))
        }),
      ),
    )
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-at-layer-utilities',
    AtRule: {
      layer: migrate,
    },
    OnceExit: (root) => {
      // Merge `@utility` definitions with the same name.
      let nameToAtRule = new Map<string, AtRule>()

      root.walkAtRules('utility', (node) => {
        let existing = nameToAtRule.get(node.params)
        if (existing) {
          // Add a newline between each `@utility` at-rule
          if (node.first) {
            node.first.raws.before = `\n${node.first?.raws.before ?? ''}`
          }
          existing.append(node.nodes ?? [])
          node.remove()
        } else {
          nameToAtRule.set(node.params, node)
        }
      })
    },
  }
}
