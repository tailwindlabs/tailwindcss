import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'

export default function(config) {
  return function(css) {
    const screens = config().screens
    const rules = []

    css.walkAtRules('responsive', atRule => {
      const nodes = atRule.nodes
      rules.push(...cloneNodes(nodes))
      atRule.before(nodes)
      atRule.remove()
    })

    _.keys(screens).forEach(screen => {
      const mediaQuery = postcss.atRule({
        name: 'media',
        params: buildMediaQuery(screens[screen]),
      })

      mediaQuery.append(
        rules.map(rule => {
          const cloned = rule.clone()
          cloned.selectors = _.map(
            rule.selectors,
            selector => `.${screen}\\:${selector.slice(1)}`
          )
          return cloned
        })
      )

      if (mediaQuery.nodes.length) {
        css.append(mediaQuery)
      }
    })
  }
}
