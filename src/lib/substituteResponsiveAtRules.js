import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'

export default function(options) {
  return function(css) {
    const rules = []

    css.walkAtRules('responsive', atRule => {
      const nodes = atRule.nodes
      rules.push(...cloneNodes(nodes))
      css.insertBefore(atRule, nodes)
      atRule.remove()
    })

    Object.keys(options.breakpoints).forEach(breakpoint => {
      const mediaQuery = postcss.atRule({
        name: 'media',
        params: `(--breakpoint-${breakpoint})`,
      })

      mediaQuery.append(
        rules.map(rule => {
          const cloned = rule.clone()
          cloned.selectors = _.map(rule.selectors, selector => `.${breakpoint}\\:${selector.slice(1)}`)
          return cloned
        })
      )
      css.append(mediaQuery)
    })
  }
}
