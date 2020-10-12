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

    let includesScreensExplicitly = false
    const layers = {
      base: [],
      components: [],
      utilities: [],
    }

    css.walkAtRules('layer', atRule => {
      if (!['base', 'components', 'utilities'].includes(atRule.params)) {
        return
      }

      layers[atRule.params].push(atRule)
    })

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        // prettier-ignore
        throw atRule.error("`@tailwind preflight` is not a valid at-rule in Tailwind v1.0, use `@tailwind base` instead.", { word: 'preflight' })
      }

      if (atRule.params === 'base') {
        atRule.after(layers.base)
        atRule.after(updateSource(pluginBase, atRule.source))
      }

      if (atRule.params === 'components') {
        atRule.after(layers.components)
        atRule.after(updateSource(pluginComponents, atRule.source))
      }

      if (atRule.params === 'utilities') {
        atRule.after(layers.utilities)
        atRule.after(updateSource(pluginUtilities, atRule.source))
      }

      if (atRule.params === 'screens') {
        includesScreensExplicitly = true
      }
    })

    if (!includesScreensExplicitly) {
      css.append([postcss.atRule({ name: 'tailwind', params: 'screens' })])
    }
  }
}
