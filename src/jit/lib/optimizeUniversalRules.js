import selectorParser from 'postcss-selector-parser'

let elementSelectorParser = selectorParser((selectors) => {
  return selectors
    .map((s) => {
      return s
        .split((n) => n.type === 'combinator')
        .pop()
        .filter((n) => n.type !== 'pseudo' || n.value.startsWith('::'))
        .join('')
    })
    .join(', ')
})

function extractElementSelector(selector) {
  return elementSelectorParser.transformSync(selector)
}

export default function collapseAdjacentRules() {
  return (root) => {
    // Walk all custom properties
    //   Collect into a map, where key is the custom property name
    //   Value is list of nodes
    // Walk '*::tailwind' rules
    //   Get list of selectors per custom property
    //     Compute element selector (remove pseudo-classes, leading selectors, etc.)
    //   Collect selectors into Set
    //   Replace '*::tailwind' with selectors from Set

    let variableNodeMap = new Map()
    let universals = new Set()

    root.walkDecls((decl) => {
      if (!decl.prop.startsWith('--')) {
        return
      }

      if (decl.parent.selector === '*::tailwind') {
        universals.add(decl.parent)
        return
      }

      let variable = decl.prop

      if (!variableNodeMap.has(variable)) {
        variableNodeMap.set(variable, new Set())
      }

      variableNodeMap.get(variable).add(decl.parent)
    })

    for (let universal of universals) {
      let selectors = new Set()

      universal.walkDecls((decl) => {
        let variable = decl.prop

        for (let node of variableNodeMap.get(variable) ?? []) {
          let elementSelector = extractElementSelector(node.selector)
          selectors.add(extractElementSelector(node.selector))
        }
      })

      universal.selectors = [...selectors]
    }
  }
}
