import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import { flagEnabled } from '../featureFlags'

function isPseudoElement(n) {
  if (n.type !== 'pseudo') {
    return false
  }

  return (
    n.value.startsWith('::') ||
    [':before', ':after', ':first-line', ':first-letter'].includes(n.value)
  )
}

function minimumImpactSelector(nodes) {
  let rest = nodes
    // Keep all pseudo & combinator types (:not([hidden]) ~ :not([hidden]))
    .filter((n) => n.type === 'pseudo' || n.type === 'combinator')
    // Remove leading pseudo's (:hover, :focus, ...)
    .filter((n, idx, all) => {
      // Keep pseudo elements
      if (isPseudoElement(n)) return true

      if (idx === 0 && n.type === 'pseudo') return false
      if (idx > 0 && n.type === 'pseudo' && all[idx - 1].type === 'pseudo') return false

      return true
    })

  let [bestNode] = nodes

  for (let [type, getNode = (n) => n] of [
    ['class'],
    [
      'id',
      (n) =>
        selectorParser.attribute({
          attribute: 'id',
          operator: '=',
          value: n.value,
          quoteMark: '"',
        }),
    ],
    ['attribute'],
  ]) {
    let match = nodes.find((n) => n.type === type)

    if (match) {
      bestNode = getNode(match)
      break
    }
  }

  return [bestNode, ...rest].join('').trim()
}

let elementSelectorParser = selectorParser((selectors) => {
  return selectors.map((s) => {
    let nodes = s.split((n) => n.type === 'combinator' && n.value === ' ').pop()
    return minimumImpactSelector(nodes)
  })
})

let cache = new Map()

function extractElementSelector(selector) {
  if (!cache.has(selector)) {
    cache.set(selector, elementSelectorParser.transformSync(selector))
  }

  return cache.get(selector)
}

export default function resolveDefaultsAtRules({ tailwindConfig }) {
  return (root) => {
    let variableNodeMap = new Map()
    let universals = new Set()

    root.walkAtRules('defaults', (rule) => {
      if (rule.nodes && rule.nodes.length > 0) {
        universals.add(rule)
        return
      }

      let variable = rule.params
      if (!variableNodeMap.has(variable)) {
        variableNodeMap.set(variable, new Set())
      }

      variableNodeMap.get(variable).add(rule.parent)

      rule.remove()
    })

    for (let universal of universals) {
      let selectors = new Set()

      let rules = variableNodeMap.get(universal.params) ?? []

      for (let rule of rules) {
        for (let selector of extractElementSelector(rule.selector)) {
          selectors.add(selector)
        }
      }

      if (selectors.size === 0) {
        universal.remove()
        continue
      }

      let universalRule = postcss.rule()

      if (flagEnabled(tailwindConfig, 'optimizeUniversalDefaults')) {
        universalRule.selectors = [...selectors]
      } else {
        universalRule.selectors = ['*', '::before', '::after']
      }

      universalRule.append(universal.nodes)
      universal.before(universalRule)
      universal.remove()
    }
  }
}
