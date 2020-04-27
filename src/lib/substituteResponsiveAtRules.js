import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'
import buildSelectorVariant from '../util/buildSelectorVariant'

export default function(config) {
  return function(css) {
    const {
      theme: { screens },
      separator,
    } = config
    const responsiveRules = postcss.root()
    const finalRules = []

    css.walkAtRules('responsive', atRule => {
      const nodes = atRule.nodes
      responsiveRules.append(...cloneNodes(nodes))
      atRule.before(nodes)
      atRule.remove()
    })

    _.keys(screens).forEach(screen => {
      const mediaQuery = postcss.atRule({
        name: 'media',
        params: buildMediaQuery(screens[screen]),
      })

      mediaQuery.append(
        _.tap(responsiveRules.clone(), clonedRoot => {
          clonedRoot.walkRules(rule => {
            rule.selectors = _.map(rule.selectors, selector =>
              buildSelectorVariant(selector, screen, separator, message => {
                throw rule.error(message)
              })
            )
          })
        })
      )

      finalRules.push(mediaQuery)
    })

    const hasScreenRules = finalRules.some(i => i.nodes.length !== 0)

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params !== 'screens') {
        return
      }

      if (hasScreenRules) {
        atRule.before(finalRules)
      }

      atRule.remove()
    })
  }
}
