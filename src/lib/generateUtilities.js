const _ = require('lodash')
const backgroundColors = require('../generators/backgroundColors')
const shadows = require('../generators/shadows')
const flex = require('../generators/flex')
const responsive = require('../util/responsive')

module.exports = function (options) {
  return function (css) {
    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'utilities') {
        const utilities = _.flatten([
          backgroundColors(options),
          shadows(options),
          flex(),
        ])
        css.insertBefore(atRule, responsive(utilities))
        atRule.remove()
      }
    })
  }
}
