import postcss from 'postcss'
import parser from 'postcss-selector-parser'

import { resolveMatches } from './generateRules'
import bigSign from '../util/bigSign'
import escapeClassName from '../util/escapeClassName'

function extractClasses(node) {
  let classes = new Set()
  let container = postcss.root({ nodes: [node.clone()] })

  container.walkRules((rule) => {
    parser((selectors) => {
      selectors.walkClasses((classSelector) => {
        classes.add(classSelector.value)
      })
    }).processSync(rule.selector)
  })

  return Array.from(classes)
}

function extractBaseCandidates(candidates, separator) {
  let baseClasses = new Set()

  for (let candidate of candidates) {
    baseClasses.add(candidate.split(separator).pop())
  }

  return Array.from(baseClasses)
}

function prefix(context, selector) {
  let prefix = context.tailwindConfig.prefix
  return typeof prefix === 'function' ? prefix(selector) : prefix + selector
}

function buildApplyCache(applyCandidates, context) {
  for (let candidate of applyCandidates) {
    if (context.notClassCache.has(candidate) || context.applyClassCache.has(candidate)) {
      continue
    }

    if (context.classCache.has(candidate)) {
      context.applyClassCache.set(
        candidate,
        context.classCache.get(candidate).map(([meta, rule]) => [meta, rule.clone()])
      )
      continue
    }

    let matches = Array.from(resolveMatches(candidate, context))

    if (matches.length === 0) {
      context.notClassCache.add(candidate)
      continue
    }

    context.applyClassCache.set(candidate, matches)
  }

  return context.applyClassCache
}

function extractApplyCandidates(params) {
  let candidates = params.split(/[\s\t\n]+/g)

  if (candidates[candidates.length - 1] === '!important') {
    return [candidates.slice(0, -1), true]
  }

  return [candidates, false]
}

function partitionApplyParents(root) {
  let applyParents = new Set()

  root.walkAtRules('apply', (rule) => {
    applyParents.add(rule.parent)
  })

  for (let rule of applyParents) {
    let nodeGroups = []
    let lastGroup = []

    for (let node of rule.nodes) {
      if (node.type === 'atrule' && node.name === 'apply') {
        if (lastGroup.length > 0) {
          nodeGroups.push(lastGroup)
          lastGroup = []
        }
        nodeGroups.push([node])
      } else {
        lastGroup.push(node)
      }
    }

    if (lastGroup.length > 0) {
      nodeGroups.push(lastGroup)
    }

    if (nodeGroups.length === 1) {
      continue
    }

    for (let group of [...nodeGroups].reverse()) {
      let newParent = rule.clone({ nodes: [] })
      newParent.append(group)
      rule.after(newParent)
    }

    rule.remove()
  }
}

function processApply(root, context) {
  let applyCandidates = new Set()

  // Collect all @apply rules and candidates
  let applies = []
  root.walkAtRules('apply', (rule) => {
    let [candidates] = extractApplyCandidates(rule.params)

    for (let util of candidates) {
      applyCandidates.add(util)
    }

    applies.push(rule)
  })

  // Start the @apply process if we have rules with @apply in them
  if (applies.length > 0) {
    // Fill up some caches!
    let applyClassCache = buildApplyCache(applyCandidates, context)

    /**
     * When we have an apply like this:
     *
     * .abc {
     *    @apply hover:font-bold;
     * }
     *
     * What we essentially will do is resolve to this:
     *
     * .abc {
     *    @apply .hover\:font-bold:hover {
     *      font-weight: 500;
     *    }
     * }
     *
     * Notice that the to-be-applied class is `.hover\:font-bold:hover` and that the utility candidate was `hover:font-bold`.
     * What happens in this function is that we prepend a `.` and escape the candidate.
     * This will result in `.hover\:font-bold`
     * Which means that we can replace `.hover\:font-bold` with `.abc` in `.hover\:font-bold:hover` resulting in `.abc:hover`
     */
    // TODO: Should we use postcss-selector-parser for this instead?
    function replaceSelector(selector, utilitySelectors, candidate) {
      let needle = `.${escapeClassName(candidate)}`
      let utilitySelectorsList = utilitySelectors.split(/\s*\,(?![^(]*\))\s*/g)

      return selector
        .split(/\s*\,(?![^(]*\))\s*/g)
        .map((s) => {
          let replaced = []

          for (let utilitySelector of utilitySelectorsList) {
            let replacedSelector = utilitySelector.replace(needle, s)
            if (replacedSelector === utilitySelector) {
              continue
            }
            replaced.push(replacedSelector)
          }
          return replaced.join(', ')
        })
        .join(', ')
    }

    let perParentApplies = new Map()

    // Collect all apply candidates and their rules
    for (let apply of applies) {
      let candidates = perParentApplies.get(apply.parent) || []

      perParentApplies.set(apply.parent, candidates)

      let [applyCandidates, important] = extractApplyCandidates(apply.params)

      if (apply.parent.type === 'atrule') {
        if (apply.parent.name === 'screen') {
          const screenType = apply.parent.params

          throw apply.error(
            `@apply is not supported within nested at-rules like @screen. We suggest you write this as @apply ${applyCandidates
              .map((c) => `${screenType}:${c}`)
              .join(' ')} instead.`
          )
        }

        throw apply.error(
          `@apply is not supported within nested at-rules like @${apply.parent.name}. You can fix this by un-nesting @${apply.parent.name}.`
        )
      }

      for (let applyCandidate of applyCandidates) {
        if (!applyClassCache.has(applyCandidate)) {
          if (applyCandidate === prefix(context, 'group')) {
            // TODO: Link to specific documentation page with error code.
            throw apply.error(`@apply should not be used with the '${applyCandidate}' utility`)
          }

          throw apply.error(
            `The \`${applyCandidate}\` class does not exist. If \`${applyCandidate}\` is a custom class, make sure it is defined within a \`@layer\` directive.`
          )
        }

        let rules = applyClassCache.get(applyCandidate)

        candidates.push([applyCandidate, important, rules])
      }
    }

    for (const [parent, candidates] of perParentApplies) {
      let siblings = []

      for (let [applyCandidate, important, rules] of candidates) {
        for (let [meta, node] of rules) {
          let parentClasses = extractClasses(parent)
          let nodeClasses = extractClasses(node)

          // Add base utility classes from the @apply node to the list of
          // classes to check whether it intersects and therefore results in a
          // circular dependency or not.
          //
          // E.g.:
          // .foo {
          //   @apply hover:a; // This applies "a" but with a modifier
          // }
          //
          // We only have to do that with base classes of the `node`, not of the `parent`
          // E.g.:
          // .hover\:foo {
          //   @apply bar;
          // }
          // .bar {
          //   @apply foo;
          // }
          //
          // This should not result in a circular dependency because we are
          // just applying `.foo` and the rule above is `.hover\:foo` which is
          // unrelated. However, if we were to apply `hover:foo` then we _did_
          // have to include this one.
          nodeClasses = nodeClasses.concat(
            extractBaseCandidates(nodeClasses, context.tailwindConfig.separator)
          )

          let intersects = parentClasses.some((selector) => nodeClasses.includes(selector))
          if (intersects) {
            throw node.error(
              `You cannot \`@apply\` the \`${applyCandidate}\` utility here because it creates a circular dependency.`
            )
          }

          let root = postcss.root({ nodes: [node.clone()] })
          let canRewriteSelector =
            node.type !== 'atrule' || (node.type === 'atrule' && node.name !== 'keyframes')

          if (canRewriteSelector) {
            root.walkRules((rule) => {
              // Let's imagine you have the following structure:
              //
              // .foo {
              //   @apply bar;
              // }
              //
              // @supports (a: b) {
              //   .bar {
              //     color: blue
              //   }
              //
              //   .something-unrelated {}
              // }
              //
              // In this case we want to apply `.bar` but it happens to be in
              // an atrule node. We clone that node instead of the nested one
              // because we still want that @supports rule to be there once we
              // applied everything.
              //
              // However it happens to be that the `.something-unrelated` is
              // also in that same shared @supports atrule. This is not good,
              // and this should not be there. The good part is that this is
              // a clone already and it can be safely removed. The question is
              // how do we know we can remove it. Basically what we can do is
              // match it against the applyCandidate that you want to apply. If
              // it doesn't match the we can safely delete it.
              //
              // If we didn't do this, then the `replaceSelector` function
              // would have replaced this with something that didn't exist and
              // therefore it removed the selector altogether. In this specific
              // case it would result in `{}` instead of `.something-unrelated {}`
              if (!extractClasses(rule).some((thing) => thing === applyCandidate)) {
                rule.remove()
                return
              }

              rule.selector = replaceSelector(parent.selector, rule.selector, applyCandidate)

              rule.walkDecls((d) => {
                d.important = meta.important || important
              })
            })
          }

          // Insert it
          siblings.push([
            // Ensure that when we are sorting, that we take the layer order into account
            { ...meta, sort: meta.sort | context.layerOrder[meta.layer] },
            root.nodes[0],
          ])
        }
      }

      // Inject the rules, sorted, correctly
      let nodes = siblings.sort(([a], [z]) => bigSign(a.sort - z.sort)).map((s) => s[1])

      // `parent` refers to the node at `.abc` in: .abc { @apply mt-2 }
      parent.after(nodes)
    }

    for (let apply of applies) {
      // If there are left-over declarations, just remove the @apply
      if (apply.parent.nodes.length > 1) {
        apply.remove()
      } else {
        // The node is empty, drop the full node
        apply.parent.remove()
      }
    }

    // Do it again, in case we have other `@apply` rules
    processApply(root, context)
  }
}

export default function expandApplyAtRules(context) {
  return (root) => {
    partitionApplyParents(root)
    processApply(root, context)
  }
}
