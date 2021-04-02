function removeLayerAtRules() {
  return (root) => {
    root.walkAtRules((rule) => {
      if (['layer', 'responsive', 'variants'].includes(rule.name)) {
        rule.remove()
      }
    })
  }
}

module.exports = removeLayerAtRules
