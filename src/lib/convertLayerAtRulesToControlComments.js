import postcss from 'postcss'

export default function convertLayerAtRulesToControlComments() {
  return function(css) {
    css.walkAtRules('layer', atRule => {
      const layer = atRule.params

      if (!['base', 'components', 'utilities'].includes(layer)) {
        return
      }

      atRule.before(postcss.comment({ text: `tailwind start ${layer}` }))
      atRule.before(atRule.nodes)
      atRule.before(postcss.comment({ text: `tailwind end ${layer}` }))
      atRule.remove()
    })
  }
}
