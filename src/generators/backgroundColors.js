const _ = require('lodash')
const defineClass = require('../util/defineClass')
const findColor = require('../util/findColor')

module.exports = function ({ colors, backgroundColors }) {
  if (_.isArray(backgroundColors)) {
    backgroundColors = _(backgroundColors).flatMap(color => {
      if (_.isString(color)) {
        return [[color, color]]
      }
      return _.toPairs(color)
    }).fromPairs()
  }

  return _(backgroundColors).toPairs().map(([className, colorName]) => {
    return defineClass(`bg-${className}`, {
      backgroundColor: findColor(colors, colorName),
    })
  }).value()
}
