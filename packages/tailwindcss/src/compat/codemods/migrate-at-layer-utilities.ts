import { rule, walk, WalkAction, type AstNode, type Rule } from '../../ast'
import { parse, toCss, type ValueWordNode } from '../../value-parser'

export function migrateAtLayerUtilities(ast: AstNode[]) {
  walk(ast, (node, { replaceWith }) => {
    if (
      node.kind !== 'rule' ||
      node.selector[0] !== '@' ||
      !node.selector.startsWith('@layer utilities')
    ) {
      return
    }

    // Upgrade `@layer utilities` to `@utility`
    let max = 5
    let repeat = true
    while (repeat && max-- > 0) {
      repeat = false
      walk(node.nodes, (child, { replaceWith }) => {
        if (child.kind !== 'rule') return WalkAction.Continue

        // Invert at-rules, by hoisting the rules with normal selectors to the
        // top.
        //
        // ```css
        // @media (min-width: 640px) {
        //   .foo {
        //     color: red;
        //   }
        // }
        // ```
        //
        // Becomes:
        // ```css
        // .foo {
        //   @media (min-width: 640px) {
        //     color: red;
        //   }
        // }
        // ```
        if (child.selector[0] === '@' && !child.selector.startsWith('@utility')) {
          // At-rule with multiple children need to be split into multiple
          // rules.
          if (child.nodes.length > 1) {
            replaceWith(child.nodes.map((grandChild) => rule(child.selector, [grandChild])))
            repeat = true
            return WalkAction.Skip
          }

          // At-rule with a single child can be upgraded directly
          else {
            // Hoist the child rule (with a proper selector instead of at-rule) up to the parent
            walk(child.nodes, (grandChild, { replaceWith }) => {
              if (grandChild.kind === 'rule' && grandChild.selector[0] !== '@') {
                let atRule = child.selector
                child.selector = grandChild.selector
                replaceWith(rule(atRule, grandChild.nodes))
                repeat = true
                return WalkAction.Skip
              }
            })
            return WalkAction.Skip
          }
        }

        if (child.selector[0] !== '@') {
          let parts = parse(child.selector)

          // Split `.foo.bar` into `['.foo', '.bar']`
          // Split `.foo#bar` into `['.foo', '#bar']`
          for (let idx = parts.length - 1; idx > 0; idx--) {
            if (parts[idx].kind === 'word') {
              console.log(parts[idx].value)
            }
          }

          // Fan out each utility into its own rule. E.g.:
          //
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
          // @utility bar {
          //   .foo &:hover .baz {
          //     color: red;
          //   }
          // }
          // @utility baz {
          //   .foo .bar:hover & {
          //     color: red;
          //   }
          // }
          // ```
          let variations = []
          for (let [idx, part] of parts.entries()) {
            if (part.kind === 'word' && part.value[0] === '.') {
              variations.push([
                // Name of the utility
                part.value.slice(1),

                // The new selector with the utility replaced by `&`
                toCss([
                  ...parts.slice(0, idx),
                  { kind: 'word', value: '&' } satisfies ValueWordNode,
                  ...parts.slice(idx + 1),
                ]),
              ] as const)
            }
          }

          let newRules = []
          for (let [name, selector] of variations) {
            if (selector === '&') {
              newRules.push(rule(`@utility ${name}`, child.nodes))
            } else {
              newRules.push(rule(`@utility ${name}`, [rule(selector, child.nodes)]))
            }
          }

          replaceWith(newRules)
          return WalkAction.Skip
        } else {
          return WalkAction.Skip
        }
      })
    }

    // Replace `@layer utilities` with its children, eliminating the `@layer
    // utilities` node itself.
    replaceWith(node.nodes)
    return WalkAction.Skip
  })

  // Merge `@utility` definitions with the same name.
  {
    let map = new Map<string, Rule>()

    walk(ast, (node, { replaceWith }) => {
      if (node.kind !== 'rule') return
      if (node.selector[0] !== '@' || !node.selector.startsWith('@utility')) return

      let existing = map.get(node.selector)
      if (existing) {
        for (let child of node.nodes) {
          existing.nodes.push(child)
        }
        replaceWith([])
        return WalkAction.Skip
      }

      map.set(node.selector, node)
    })
  }
}
