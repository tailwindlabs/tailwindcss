const _ = require('lodash')
const responsive = require('../util/responsive')

module.exports = function (options) {
  return function (css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = _.flatten([
          require('../generators/backgroundColors')(options),
          require('../generators/backgroundSize')(options),
          require('../generators/borderWidths')(options),
          require('../generators/shadows')(options),
          require('../generators/flex')(options),
        ])
        css.insertBefore(atRule, responsive(utilities))
        atRule.remove()
      }
    })
  }
}
