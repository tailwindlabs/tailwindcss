import _ from 'lodash'
import postcss from 'postcss'

function updateSource(nodes, source) {
  return _.tap(Array.isArray(nodes) ? postcss.root({ nodes }) : nodes, tree => {
    tree.walk(node => (node.source = source))
  })
}

export default function(
  config,
  { base: pluginBase, components: pluginComponents, utilities: pluginUtilities }
) {
  return function(css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        // prettier-ignore
        throw atRule.error("`@tailwind preflight` is not a valid at-rule in Tailwind v1.0, use `@tailwind base` instead.", { word: 'preflight' })
      }

      if (atRule.params === 'base') {
        atRule.before(updateSource(pluginBase, atRule.source))
        atRule.remove()
      }

      if (atRule.params === 'components') {
        atRule.before(updateSource(pluginComponents, atRule.source))
        atRule.remove()
      }

      if (atRule.params === 'utilities') {
        atRule.before(updateSource(pluginUtilities, atRule.source))
        atRule.remove()
      }
    })
  }
}
