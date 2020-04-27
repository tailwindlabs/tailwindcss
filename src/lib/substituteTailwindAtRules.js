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
        atRule.before(postcss.comment({ text: 'tailwind start components' }))
        atRule.before(updateSource(pluginComponents, atRule.source))
        atRule.after(postcss.comment({ text: 'tailwind end components' }))
        atRule.remove()
      }

      if (atRule.params === 'utilities') {
        atRule.before(postcss.comment({ text: 'tailwind start utilities' }))
        atRule.before(updateSource(pluginUtilities, atRule.source))
        atRule.after(postcss.comment({ text: 'tailwind end utilities' }))
        atRule.remove()
      }

      if (atRule.params === 'screens') {
        includesScreensExplicitly = true
        atRule.before(postcss.comment({ text: 'tailwind start screens' }))
        atRule.after(postcss.comment({ text: 'tailwind end screens' }))
      }
    })

    if (!includesScreensExplicitly) {
      css.append([
        postcss.comment({ text: 'tailwind start screens' }),
        postcss.atRule({ name: 'tailwind', params: 'screens' }),
        postcss.comment({ text: 'tailwind end screens' }),
      ])
    }
  }
}
