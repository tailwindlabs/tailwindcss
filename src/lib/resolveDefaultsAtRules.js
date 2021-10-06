import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import { flagEnabled } from '../featureFlags'

let getNode = {
  id(node) {
    return selectorParser.attribute({
      attribute: 'id',
      operator: '=',
      value: node.value,
      quoteMark: '"',
    })
  },
}

function minimumImpactSelector(nodes) {
  let rest = nodes
    .filter((node) => {
      // Keep non-pseudo nodes
      if (node.type !== 'pseudo') return true

      // Keep pseudo nodes that have subnodes
      // E.g.: `:not()` contains subnodes inside the parentheses
      if (node.nodes.length > 0) return true

      // Keep pseudo `elements`
      // This implicitly means that we ignore pseudo `classes`
      return (
        node.value.startsWith('::') ||
        [':before', ':after', ':first-line', ':first-letter'].includes(node.value)
      )
    })
    .reverse()

  let searchFor = new Set(['tag', 'class', 'id', 'attribute'])

  let splitPointIdx = rest.findIndex((n) => searchFor.has(n.type))
  if (splitPointIdx === -1) return rest.reverse().join('').trim()

  let node = rest[splitPointIdx]
  let bestNode = getNode[node.type] ? getNode[node.type](node) : node

  rest = rest.slice(0, splitPointIdx)

  let combinatorIdx = rest.findIndex((n) => n.type === 'combinator' && n.value === '>')
  if (combinatorIdx !== -1) {
    rest.splice(0, combinatorIdx)
    rest.unshift(selectorParser.universal())
  }

  return [bestNode, ...rest.reverse()].join('').trim()
}

export let elementSelectorParser = selectorParser((selectors) => {
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
