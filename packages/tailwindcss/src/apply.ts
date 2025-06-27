import { Features } from '.'
import { rule, toCss, walk, WalkAction, type AstNode } from './ast'
import { compileCandidates } from './compile'
import type { DesignSystem } from './design-system'
import type { SourceLocation } from './source-maps/source'
import { DefaultMap } from './utils/default-map'
import { segment } from './utils/segment'

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
  walk([root], (node, { parent, path }) => {
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
        // Mark every parent in the path as having a dependency to that utility.
        for (let parent of path) {
          if (parent === node) continue
          if (!parents.has(parent)) continue
          dependencies.get(parent).add(dependency)
        }
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

    walk(parent.nodes, (child, { replaceWith }) => {
      if (child.kind !== 'at-rule' || child.name !== '@apply') return

      let parts = child.params.split(/(\s+)/g)
      let candidateOffsets: Record<string, number> = {}

      let offset = 0
      for (let [idx, part] of parts.entries()) {
        if (idx % 2 === 0) candidateOffsets[part] = offset
        offset += part.length
      }

      // Replace the `@apply` rule with the actual utility classes
      {
        // Parse the candidates to an AST that we can replace the `@apply` rule
        // with.
        let candidates = Object.keys(candidateOffsets)
        let compiled = compileCandidates(candidates, designSystem, {
          respectImportant: false,
          onInvalidCandidate: (candidate) => {
            // When using prefix, make sure prefix is used in candidate
            if (designSystem.theme.prefix && !candidate.startsWith(designSystem.theme.prefix)) {
              throw new Error(
                `Cannot apply unprefixed utility class \`${candidate}\`. Did you mean \`${designSystem.theme.prefix}:${candidate}\`?`,
              )
            }

            // When the utility is blocklisted, let the user know
            //
            // Note: `@apply` is processed before handling incoming classes from
            // template files. This means that the `invalidCandidates` set will
            // only contain explicit classes via:
            //
            // - `blocklist` from a JS config
            // - `@source not inline(…)`
            if (designSystem.invalidCandidates.has(candidate)) {
              throw new Error(
                `Cannot apply utility class \`${candidate}\` because it has been explicitly disabled: https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-excluding-classes`,
              )
            }

            // Verify if variants exist
            let parts = segment(candidate, ':')
            if (parts.length > 1) {
              let utility = parts.pop()!

              // Ensure utility on its own compiles, if not, we will fallback to
              // the next error
              if (designSystem.candidatesToCss([utility])[0]) {
                let compiledVariants = designSystem.candidatesToCss(
                  parts.map((variant) => `${variant}:[--tw-variant-check:1]`),
                )
                let unknownVariants = parts.filter((_, idx) => compiledVariants[idx] === null)
                if (unknownVariants.length > 0) {
                  if (unknownVariants.length === 1) {
                    throw new Error(
                      `Cannot apply utility class \`${candidate}\` because the ${unknownVariants.map((variant) => `\`${variant}\``)} variant does not exist.`,
                    )
                  } else {
                    let formatter = new Intl.ListFormat('en', {
                      style: 'long',
                      type: 'conjunction',
                    })
                    throw new Error(
                      `Cannot apply utility class \`${candidate}\` because the ${formatter.format(unknownVariants.map((variant) => `\`${variant}\``))} variants do not exist.`,
                    )
                  }
                }
              }
            }

            // When the theme is empty, it means that no theme was loaded and
            // `@import "tailwindcss"`, `@reference "app.css"` or similar is
            // very likely missing.
            if (designSystem.theme.size === 0) {
              throw new Error(
                `Cannot apply unknown utility class \`${candidate}\`. Are you using CSS modules or similar and missing \`@reference\`? https://tailwindcss.com/docs/functions-and-directives#reference-directive`,
              )
            }

            // Fallback to most generic error message
            throw new Error(`Cannot apply unknown utility class \`${candidate}\``)
          },
        })

        let src = child.src

        let candidateAst = compiled.astNodes.map((node) => {
          let candidate = compiled.nodeSorting.get(node)?.candidate
          let candidateOffset = candidate ? candidateOffsets[candidate] : undefined

          node = structuredClone(node)

          if (!src || !candidate || candidateOffset === undefined) {
            // While the original nodes may have come from an `@utility` we still
            // want to replace the source because the `@apply` is ultimately the
            // reason the node was emitted into the AST.
            walk([node], (node) => {
              node.src = src
            })

            return node
          }

          let candidateSrc: SourceLocation = [src[0], src[1], src[2]]

          candidateSrc[1] += 7 /* '@apply '.length */ + candidateOffset
          candidateSrc[2] = candidateSrc[1] + candidate.length

          // While the original nodes may have come from an `@utility` we still
          // want to replace the source because the `@apply` is ultimately the
          // reason the node was emitted into the AST.
          walk([node], (node) => {
            node.src = candidateSrc
          })

          return node
        })

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

        replaceWith(newNodes)
      }
    })
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
