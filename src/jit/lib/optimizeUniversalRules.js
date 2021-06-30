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

export default function collapseAdjacentRules() {
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
      let rule = postcss.rule()

      universal.walkDecls((decl) => {
        let variable = decl.prop

        for (let node of variableNodeMap.get(variable) ?? []) {
          for (let selector of extractElementSelector(node.selector)) {
            selectors.add(selector)
          }
        }
      })

      rule.selectors = [...selectors]
      rule.append(universal.clone().nodes)
      universal.before(rule)
      universal.remove()
    }
  }
}
