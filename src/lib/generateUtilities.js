const _ = require('lodash')
const postcss = require('postcss')
const backgroundColors = require('../generators/backgroundColors')
const shadows = require('../generators/shadows')
const flex = require('../generators/flex')
const cloneNodes = require('../util/cloneNodes')

module.exports = function (options) {
  return function (css) {
    const rules = []

    css.walkAtRules(atRule => {
      if (atRule.name === 'responsive') {
        const nodes = atRule.nodes
        rules.push(...cloneNodes(nodes))
        css.insertBefore(atRule, nodes)
        atRule.remove()
      }
      if (atRule.name === 'tailwind' && atRule.params === 'utilities') {
        const utilities = _.flatten([
          backgroundColors(options),
          shadows(options),
          flex(),
        ])
        rules.push(...cloneNodes(utilities))
        css.insertBefore(atRule, utilities)
        atRule.remove()
      }
    })

    Object.keys(options.breakpoints).forEach(breakpoint => {
      const mediaQuery = postcss.atRule({
        name: 'media',
        params: `(--breakpoint-${breakpoint})`,
      })

      mediaQuery.append(rules.map(rule => {
        const cloned = rule.clone()
        cloned.selector = `.${breakpoint}\\:${rule.selector.slice(1)}`
        return cloned
      }))
      css.append(mediaQuery)
    })
  }
}
