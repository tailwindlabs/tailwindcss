import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'
import buildClassVariant from '../util/buildClassVariant'

export default function(config) {
  return function(css) {
    const screens = config().screens
    const separator = config().options.separator
    const responsiveRules = []
    let finalRules = []

    css.walkAtRules('responsive', atRule => {
      const nodes = atRule.nodes
      responsiveRules.push(...cloneNodes(nodes))
      atRule.before(nodes)
      atRule.remove()
    })

    _.keys(screens).forEach(screen => {
      const mediaQuery = postcss.atRule({
        name: 'media',
        params: buildMediaQuery(screens[screen]),
      })

      mediaQuery.append(
        responsiveRules.map(rule => {
          const cloned = rule.clone()
          cloned.selectors = _.map(rule.selectors, selector =>
            buildClassVariant(selector, screen, separator)
          )
          return cloned
        })
      )

      finalRules.push(mediaQuery)
    })

    const hasScreenRules = finalRules.some(i => i.nodes.length !== 0)

    if (!hasScreenRules) {
      return
    }

    let includesScreensExplicitly = false

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'screens') {
        atRule.replaceWith(finalRules)
        includesScreensExplicitly = true
      }
    })

    if (!includesScreensExplicitly) {
      css.append(finalRules)
      return
    }
  }
}
