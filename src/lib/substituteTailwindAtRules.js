import _ from 'lodash'
import postcss from 'postcss'

function updateSource(nodes, source) {
  return _.tap(Array.isArray(nodes) ? postcss.root({ nodes }) : nodes, tree => {
    tree.walk(node => (node.source = source))
  })
}

export default function(
  _config,
  { base: pluginBase, components: pluginComponents, utilities: pluginUtilities }
) {
  return function(css) {
    css.walkAtRules('import', atRule => {
      if (atRule.params === '"tailwindcss/base"' || atRule.params === "'tailwindcss/base'") {
        atRule.name = 'tailwind'
        atRule.params = 'base'
      }

      if (
        atRule.params === '"tailwindcss/components"' ||
        atRule.params === "'tailwindcss/components'"
      ) {
        atRule.name = 'tailwind'
        atRule.params = 'components'
      }

      if (
        atRule.params === '"tailwindcss/utilities"' ||
        atRule.params === "'tailwindcss/utilities'"
      ) {
        atRule.name = 'tailwind'
        atRule.params = 'utilities'
      }

      if (atRule.params === '"tailwindcss/screens"' || atRule.params === "'tailwindcss/screens'") {
        atRule.name = 'tailwind'
        atRule.params = 'screens'
      }
    })

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'screens') {
        atRule.name = 'screens'
        atRule.params = 'utilities'
      }
    })

    let includesScreensExplicitly = false

    function hasChildren(atRule) {
      return atRule.nodes !== undefined && atRule.nodes.length > 0
    }

    function extractChildren(atRule, bucket) {
      if (hasChildren(atRule)) {
        atRule.walkAtRules('variants', variantsAtRule => {
          const params = postcss.list.comma(variantsAtRule.params)
          if (params.includes('responsive')) {
            variantsAtRule.params = params.filter(p => p !== 'responsive').join(', ')
            variantsAtRule.before(
              postcss.atRule({ name: 'responsive', nodes: [variantsAtRule.clone()] })
            )
            variantsAtRule.remove()
          }
        })

        atRule.walkAtRules('responsive', responsiveAtRule => {
          responsiveAtRule.params = bucket
        })

        atRule.before(atRule.nodes)
      }
    }

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        // prettier-ignore
        throw atRule.error("`@tailwind preflight` is not a valid at-rule in Tailwind v1.0, use `@tailwind base` instead.", { word: 'preflight' })
      }

      if (atRule.params === 'base') {
        atRule.before(postcss.comment({ text: 'tailwind start base' }))
        atRule.before(updateSource(pluginBase, atRule.source))
        extractChildren(atRule, 'base')
        atRule.before(postcss.comment({ text: 'tailwind end base' }))
        atRule.remove()
      }

      if (atRule.params === 'components') {
        atRule.before(postcss.comment({ text: 'tailwind start components' }))
        atRule.before(updateSource(pluginComponents, atRule.source))
        extractChildren(atRule, 'components')
        atRule.before(postcss.comment({ text: 'tailwind end components' }))
        atRule.remove()
      }

      if (atRule.params === 'utilities') {
        atRule.before(postcss.comment({ text: 'tailwind start utilities' }))
        atRule.before(updateSource(pluginUtilities, atRule.source))
        extractChildren(atRule, 'utilities')
        atRule.before(postcss.comment({ text: 'tailwind end utilities' }))
        atRule.remove()
      }
    })

    if (!includesScreensExplicitly) {
      css.append([postcss.atRule({ name: 'tailwind', params: 'screens' })])
    }
  }
}
