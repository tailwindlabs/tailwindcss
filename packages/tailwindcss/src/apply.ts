import { Features } from '.'
import { rule, toCss, walk, WalkAction, type AstNode } from './ast'
import { compileCandidates } from './compile'
import type { DesignSystem } from './design-system'
import { DefaultMap } from './utils/default-map'

export function substituteAtApply(ast: AstNode[], designSystem: DesignSystem) {
  let features = Features.None

  // Wrap the whole AST in a root rule to make sure there is always a parent
  // available for `@apply` at-rules. In some cases, the incoming `ast` just
  // contains `@apply` at-rules which means that there is no proper parent to
  // rely on.
  let root = rule('&', ast)

  // Track all nodes containing `@apply`
  let parents = new Set<AstNode>()

  // Track all the dependencies of an `AstNode`
  let dependencies = new DefaultMap<AstNode, Set<string>>(() => new Set<string>())

  // Track all `@utility` definitions by its root (name)
  let definitions = new DefaultMap(() => new Set<AstNode>())

  // Collect all new `@utility` definitions and all `@apply` rules first
  walk([root], (node, { parent }) => {
    if (node.kind !== 'at-rule') return

    // Do not allow `@apply` rules inside `@keyframes` rules.
    if (node.name === '@keyframes') {
      walk(node.nodes, (child) => {
        if (child.kind === 'at-rule' && child.name === '@apply') {
          throw new Error(`You cannot use \`@apply\` inside \`@keyframes\`.`)
        }
      })
      return WalkAction.Skip
    }

    // `@utility` defines a utility, which is important information in order to
    // do a correct topological sort later on.
    if (node.name === '@utility') {
      let name = node.params.replace(/-\*$/, '')
      definitions.get(name).add(node)

      // In case `@apply` rules are used inside `@utility` rules.
      walk(node.nodes, (child) => {
        if (child.kind !== 'at-rule' || child.name !== '@apply') return

        parents.add(node)

        for (let dependency of resolveApplyDependencies(child, designSystem)) {
          dependencies.get(node).add(dependency)
        }
      })
      return
    }

    // Any other `@apply` node.
    if (node.name === '@apply') {
      // `@apply` cannot be top-level, so we need to have a parent such that we
      // can replace the `@apply` node with the actual utility classes later.
      if (parent === null) return

      features |= Features.AtApply

      parents.add(parent)

      for (let dependency of resolveApplyDependencies(node, designSystem)) {
        dependencies.get(parent).add(dependency)
      }
    }
  })

  // Topological sort before substituting `@apply`
  let seen = new Set<AstNode>()
  let sorted: AstNode[] = []
  let wip = new Set<AstNode>()

  function visit(node: AstNode, path: AstNode[] = []) {
    if (seen.has(node)) {
      return
    }

    // Circular dependency detected
    if (wip.has(node)) {
      // Next node in the path is the one that caused the circular dependency
      let next = path[(path.indexOf(node) + 1) % path.length]

      if (
        node.kind === 'at-rule' &&
        node.name === '@utility' &&
        next.kind === 'at-rule' &&
        next.name === '@utility'
      ) {
        walk(node.nodes, (child) => {
          if (child.kind !== 'at-rule' || child.name !== '@apply') return

          let candidates = child.params.split(/\s+/g)
          for (let candidate of candidates) {
            for (let candidateAstNode of designSystem.parseCandidate(candidate)) {
              switch (candidateAstNode.kind) {
                case 'arbitrary':
                  break

                case 'static':
                case 'functional':
                  if (next.params.replace(/-\*$/, '') === candidateAstNode.root) {
                    throw new Error(
                      `You cannot \`@apply\` the \`${candidate}\` utility here because it creates a circular dependency.`,
                    )
                  }
                  break

                default:
                  candidateAstNode satisfies never
              }
            }
          }
        })
      }

      // Generic fallback error in case we cannot properly detect the origin of
      // the circular dependency.
      throw new Error(
        `Circular dependency detected:\n\n${toCss([node])}\nRelies on:\n\n${toCss([next])}`,
      )
    }

    wip.add(node)

    for (let dependencyId of dependencies.get(node)) {
      for (let dependency of definitions.get(dependencyId)) {
        path.push(node)
        visit(dependency, path)
        path.pop()
      }
    }

    seen.add(node)
    wip.delete(node)

    sorted.push(node)
  }

  for (let node of parents) {
    visit(node)
  }

  // Substitute the `@apply` at-rules in order. Note that the list is going to
  // be flattened so we do not have to recursively walk over child rules
  for (let parent of sorted) {
    if (!('nodes' in parent)) continue

    for (let i = 0; i < parent.nodes.length; i++) {
      let node = parent.nodes[i]
      if (node.kind !== 'at-rule' || node.name !== '@apply') continue

      let candidates = node.params.split(/\s+/g)

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
          if (candidateNode.kind === 'rule') {
            for (let child of candidateNode.nodes) {
              newNodes.push(child)
            }
          } else {
            newNodes.push(candidateNode)
          }
        }

        parent.nodes.splice(i, 1, ...newNodes)
      }
    }
  }
  return features
}

function* resolveApplyDependencies(
  node: Extract<AstNode, { kind: 'at-rule' }>,
  designSystem: DesignSystem,
) {
  for (let candidate of node.params.split(/\s+/g)) {
    for (let node of designSystem.parseCandidate(candidate)) {
      switch (node.kind) {
        case 'arbitrary':
          // Doesn't matter, because there is no lookup needed
          break

        case 'static':
        case 'functional':
          // Lookup by "root"
          yield node.root
          break

        default:
          node satisfies never
      }
    }
  }
}
