import { type AtRule, type Comment, type Plugin, type Rule } from 'postcss'
import SelectorParser from 'postcss-selector-parser'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { Stylesheet } from '../../stylesheet'
import { walk, WalkAction, walkDepth } from '../../utils/walk'

export function migrateAtLayerUtilities(stylesheet: Stylesheet): Plugin {
  function migrate(atRule: AtRule) {
    // Only migrate `@layer utilities` and `@layer components`.
    if (atRule.params !== 'utilities' && atRule.params !== 'components') return

    // Keep rules that should not be turned into utilities as is. This will
    // include rules with element or ID selectors.
    let defaultsAtRule = atRule.clone()

    // Clone each rule with multiple selectors into their own rule with a single
    // selector.
    walk(atRule, (node) => {
      if (node.type !== 'rule') return

      // Clone the node for each selector
      let selectors = segment(node.selector, ',')
      if (selectors.length > 1) {
        let clonedNodes: Rule[] = []
        for (let selector of selectors) {
          let clone = node.clone({ selector })
          clonedNodes.push(clone)
        }
        node.replaceWith(clonedNodes)
      }

      return WalkAction.Skip
    })

    // Track all the classes that we want to create an `@utility` for.
    let classes = new Set<string>()

    walk(atRule, (node) => {
      if (node.type !== 'rule') return

      // Find all the classes in the selector
      SelectorParser((selectors) => {
        selectors.each((selector) => {
          walk(selector, (selectorNode) => {
            // Ignore everything in `:not(…)`
            if (selectorNode.type === 'pseudo' && selectorNode.value === ':not') {
              return WalkAction.Skip
            }

            if (selectorNode.type === 'class') {
              classes.add(selectorNode.value)
            }
          })
        })
      }).processSync(node.selector, { updateSelector: false })

      return WalkAction.Skip
    })

    // Remove all the nodes from the default `@layer utilities` that we know
    // should be turned into `@utility` at-rules.
    walk(defaultsAtRule, (node) => {
      if (node.type !== 'rule') return

      SelectorParser((selectors) => {
        selectors.each((selector) => {
          walk(selector, (selectorNode) => {
            // Ignore everything in `:not(…)`
            if (selectorNode.type === 'pseudo' && selectorNode.value === ':not') {
              return WalkAction.Skip
            }

            // Remove the node if the class is in the list
            if (selectorNode.type === 'class' && classes.has(selectorNode.value)) {
              node.remove()
              return WalkAction.Stop
            }
          })
        })
      }).processSync(node, { updateSelector: true })
    })

    // Upgrade every Rule in `@layer utilities` to an `@utility` at-rule.
    let clones: AtRule[] = [defaultsAtRule]
    for (let cls of classes) {
      let clone = atRule.clone()
      clones.push(clone)

      walk(clone, (node) => {
        if (node.type === 'atrule') {
          if (!node.nodes || node.nodes?.length === 0) {
            node.remove()
          }
        }

        if (node.type !== 'rule') return

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
        let containsClass = false
        SelectorParser((selectors) => {
          selectors.each((selector) => {
            walk(selector, (selectorNode) => {
              // Ignore everything in `:not(…)`
              if (selectorNode.type === 'pseudo' && selectorNode.value === ':not') {
                return WalkAction.Skip
              }

              // Replace the class with `&` and track the new selector
              if (selectorNode.type === 'class' && selectorNode.value === cls) {
                containsClass = true

                // Find the node in the clone based on the position of the
                // original node.
                let target = selector.atPosition(
                  selectorNode.source!.start!.line,
                  selectorNode.source!.start!.column,
                )

                // Keep moving the target to the front until we hit the start or
                // find a combinator. This is to prevent `.foo.bar` from
                // becoming `.bar&`. Instead we want `&.bar`.
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
              }
            })
          })
        }).processSync(node, { updateSelector: true })

        // Cleanup all the nodes that should not be part of the `@utility` rule.
        if (!containsClass) {
          let toRemove: (Comment | Rule)[] = [node]
          let idx = node.parent?.index(node) ?? null
          if (idx !== null) {
            for (let i = idx - 1; i >= 0; i--) {
              if (node.parent?.nodes.at(i)?.type === 'rule') {
                break
              }
              if (node.parent?.nodes.at(i)?.type === 'comment') {
                toRemove.push(node.parent?.nodes.at(i) as Comment)
              }
            }
          }
          for (let node of toRemove) {
            node.remove()
          }
        }

        return WalkAction.Skip
      })

      // Migrate the `@layer utilities` to `@utility <name>`
      clone.name = 'utility'
      clone.params = cls

      clone.raws.before = `${clone.raws.before ?? ''}\n\n`
    }

    // Cleanup
    for (let idx = clones.length - 1; idx >= 0; idx--) {
      let clone = clones[idx]

      walkDepth(clone, (node) => {
        // Remove comments from the main `@layer utilities` we want to keep,
        // that are part of any of the other clones.
        if (clone === defaultsAtRule) {
          if (node.type === 'comment') {
            let found = false
            for (let other of clones) {
              if (other === defaultsAtRule) continue

              walk(other, (child) => {
                if (
                  child.type === 'comment' &&
                  child.source?.start?.offset === node.source?.start?.offset
                ) {
                  node.remove()
                  found = true
                  return WalkAction.Stop
                }
              })

              if (found) {
                return WalkAction.Skip
              }
            }
          }
        }

        // Remove empty rules
        if ((node.type === 'rule' || node.type === 'atrule') && node.nodes?.length === 0) {
          node.remove()
        }

        // Replace `&` selectors with its children
        else if (node.type === 'rule' && node.selector === '&') {
          interface PostCSSNode {
            type: string
            parent?: PostCSSNode
          }

          let parent: PostCSSNode | undefined = node.parent
          let skip = false
          while (parent) {
            if (parent.type === 'rule') {
              skip = true
              break
            }

            parent = parent.parent
          }

          if (!skip) node.replaceWith(node.nodes)
        }
      })

      // Remove empty clones entirely
      if (clone.nodes?.length === 0) {
        clones.splice(idx, 1)
      }
    }

    // Finally, replace the original `@layer utilities` with the new rules.
    atRule.replaceWith(clones)
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-at-layer-utilities',
    OnceExit: (root, { atRule }) => {
      let layers = stylesheet.layers()
      let isUtilityStylesheet = layers.has('utilities') || layers.has('components')

      if (isUtilityStylesheet) {
        let rule = atRule({ name: 'layer', params: 'utilities' })
        rule.append(root.nodes)
        root.append(rule)
      }

      // Migrate `@layer utilities` and `@layer components` into `@utility`.
      // Using this instead of the visitor API in case we want to use
      // postcss-nesting in the future.
      root.walkAtRules('layer', migrate)

      // Merge `@utility <name>` with the same name into a single rule. This can
      // happen when the same classes is used in multiple `@layer utilities`
      // blocks.
      {
        let utilities = new Map<string, AtRule>()
        walk(root, (child) => {
          if (child.type === 'atrule' && child.name === 'utility') {
            let existing = utilities.get(child.params)
            if (existing) {
              existing.append(child.nodes!)
              child.remove()
            } else {
              utilities.set(child.params, child)
            }
          }
        })
      }

      // If the stylesheet is inside a layered import then we can remove the top-level layer directive we added
      if (isUtilityStylesheet) {
        root.each((node) => {
          if (node.type !== 'atrule') return
          if (node.name !== 'layer') return
          if (node.params !== 'utilities') return

          node.replaceWith(node.nodes ?? [])
        })
      }
    },
  }
}
