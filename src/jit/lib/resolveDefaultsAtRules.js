import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

let elementSelectorParser = selectorParser((selectors) => {
  return selectors.map((s) => {
    return s
      .split((n) => n.type === 'combinator')
      .pop()
      .filter((n) => n.type !== 'pseudo' || n.value.startsWith('::'))
      .join('')
      .trim()
  })
})

let cache = new Map()

function extractElementSelector(selector) {
  if (!cache.has(selector)) {
    cache.set(selector, elementSelectorParser.transformSync(selector))
  }

  return cache.get(selector)
}

export default function resolveDefaultsAtRules() {
  return (root) => {
    let variableNodeMap = new Map()
    let universals = new Set()

    root.walkAtRules('defaults', (rule) => {
      if (rule.nodes.length > 0) {
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
      universalRule.selectors = [...selectors]
      universalRule.append(universal.nodes)
      universal.before(universalRule)
      universal.remove()
    }
  }
}
