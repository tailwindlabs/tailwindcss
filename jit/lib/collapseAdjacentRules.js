let comparisonMap = {
  atrule: ['name', 'params'],
  rule: ['selector'],
}
let types = new Set(Object.keys(comparisonMap))

function collapseAdjacentRules() {
  return (root) => {
    let currentRule = null
    root.each((node) => {
      if (!types.has(node.type)) {
        currentRule = null
        return
      }

      if (currentRule === null) {
        currentRule = node
        return
      }

      let properties = comparisonMap[node.type]

      if (node.type === 'atrule' && node.name === 'font-face') {
        currentRule = node
      } else if (properties.every((property) => node[property] === currentRule[property])) {
        currentRule.append(node.nodes)
        node.remove()
      } else {
        currentRule = node
      }
    })
  }
}

module.exports = collapseAdjacentRules
