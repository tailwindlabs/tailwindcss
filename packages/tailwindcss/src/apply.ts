import { walk, type AstNode } from './ast'
import { compileCandidates } from './compile'
import type { DesignSystem } from './design-system'
import { escape } from './utils/escape'

export function substituteAtApply(ast: AstNode[], designSystem: DesignSystem) {
  walk(ast, (node, { replaceWith }) => {
    if (node.kind !== 'rule') return
    if (!(node.selector[0] === '@' && node.selector.startsWith('@apply '))) return

    let candidates = node.selector
      .slice(7 /* Ignore `@apply ` when parsing the selector */)
      .trim()
      .split(/\s+/g)

    // Replace the `@apply` rule with the actual utility classes
    {
      // Parse the candidates to an AST that we can replace the `@apply` rule
      // with.
      let candidateAst = compileCandidates(candidates, designSystem, {
        onInvalidCandidate: (candidate) => {
          throw new Error(`Cannot apply unknown utility class: ${candidate}`)
        },
      }).astNodes

      // Collect the nodes to insert in place of the `@apply` rule. When a rule
      // was used, we want to insert its children instead of the rule because we
      // don't want the wrapping selector.
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

      // Verify that we don't have any circular dependencies by verifying that
      // the current node does not appear in the new nodes.
      walk(newNodes, (child) => {
        if (child !== node) return

        // At this point we already know that we have a circular dependency.
        //
        // Figure out which candidate caused the circular dependency. This will
        // help to create a useful error message for the end user.
        for (let candidate of candidates) {
          let selector = `.${escape(candidate)}`

          for (let rule of candidateAst) {
            if (rule.kind !== 'rule') continue
            if (rule.selector !== selector) continue

            walk(rule.nodes, (child) => {
              if (child !== node) return

              throw new Error(
                `You cannot \`@apply\` the \`${candidate}\` utility here because it creates a circular dependency.`,
              )
            })
          }
        }
      })

      replaceWith(newNodes)
    }
  })
}
