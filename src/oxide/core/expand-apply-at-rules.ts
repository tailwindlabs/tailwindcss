import postcss, { Rule } from 'postcss'
import type { Node, Root, Container } from 'postcss'
import parser from 'postcss-selector-parser'

import { resolveMatches } from './resolve-matches'
import { Offsets } from '../../lib/offsets'

interface TailwindContext {
  offsets: Offsets
}

let processor = parser()

// Remove escapes and leading `.`: `.hover\:font-bold` -> `hover:font-bold`
function toCandidate(selector: string) {
  return processor.astSync(selector).nodes[0].nodes[0].value
}

// Make sure the selector is strictly a single class
function isApplyable(node: Node) {
  if (!(node instanceof Rule)) return

  let ast = processor.astSync(node.selector)

  return (
    ast.nodes.length === 1 &&
    ast.nodes[0].nodes.length === 1 &&
    ast.nodes[0].nodes[0].type === 'class'
  )
}

// Extract applyable classes into a map
function collectUserCSSApplyables(
  root: Container,
  context: TailwindContext,
  applyables = new Map()
) {
  root.each((node) => {
    if (node.type === 'rule' && isApplyable(node)) {
      let candidate = toCandidate(node.selector)
      let rules = applyables.get(candidate) ?? []
      applyables.set(candidate, [...rules, [context.offsets.create('user'), node.clone()]])
    }
  })

  return applyables
}

interface RuleOffset {
  layer: 'base' | 'defaults' | 'components' | 'utilities' | 'variants' | 'user'
  parentLayer: 'base' | 'defaults' | 'components' | 'utilities' | 'variants' | 'user'
  arbitrary: bigint
  variants: bigint
  parallelIndex: bigint
  index: bigint
  options: {
    id: number
    sort?: Function
    value: string | null
    modifier: string | null
  }[]
}

export function expandApplyAtRules(context: TailwindContext) {
  function* resolvePluginMatches(
    rule: Container,
    apply: string,
    cache: Map<string, [RuleOffset, Rule][]>
  ) {
    if (!cache.has(apply)) {
      for (let [info, rule] of resolveMatches(apply, context)) {
        if (!isApplyable(rule)) continue
        cache.set(apply, [...(cache.get(apply) ?? []), [info.sort, rule]])
      }
    }

    if (!cache.has(apply)) {
      throw rule.error(
        `The \`${apply}\` class does not exist. If \`${apply}\` is a custom class, make sure it is defined within a \`@layer\` directive.`
      )
    }

    yield* cache.get(apply) ?? []
  }

  return (root: Root) => {
    // Collect apply-ables
    let applyables = collectUserCSSApplyables(root, context)

    // Already resolved cache
    let resolvedMatchesCache = new Map<string, [RuleOffset, Rule][]>()

    // Replace `@apply` with nodes from matching applyable
    root.walkAtRules('apply', function processApplyAtRules(rule) {
      let applies = postcss.list.space(rule.params)
      let importantIdx = applies.indexOf('!important')
      let important = importantIdx !== -1
      if (important) {
        applies.splice(importantIdx, 1)
      }

      let resolvedRules = context.offsets.sort(
        applies.flatMap((apply) => [
          ...(applyables.get(apply) ?? []),
          ...resolvePluginMatches(rule, apply, resolvedMatchesCache),
        ])
      ) as [RuleOffset, Rule][]

      for (let [, applyRule] of resolvedRules) {
        console.log(applyRule.toString())
        applyRule = applyRule.clone()
        if (important) {
          applyRule.walkDecls((decl) => {
            decl.important = important
          })
        }
        rule.before(applyRule.nodes)
      }

      rule.remove()

      // Recursively apply @apply
      root.walkAtRules('apply', processApplyAtRules)
    })
  }
}
