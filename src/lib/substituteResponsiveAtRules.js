import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'


export default function(config) {
  return function (css) {
    const screens = config().screens
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
          cloned.selectors = _.map(rule.selectors, selector => `.${screen}\\:${selector.slice(1)}`)
          return cloned
        })
      )


      finalRules.push(mediaQuery)
    })

    let includesScreenUtilitiesExplicitly = false
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'screen-utilities') {
        includesScreenUtilitiesExplicitly = true
        atRule.replaceWith(finalRules)
      }
    })

    if(! includesScreenUtilitiesExplicitly) {
      css.append(finalRules)
    }
  }
}
