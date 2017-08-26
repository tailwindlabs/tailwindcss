const _ = require('lodash')
const defineClass = require('../util/defineClass')
const findColor = require('../util/findColor')

module.exports = function (colors, colorPool) {
  if (_.isArray(colors)) {
    colors = _(colors).flatMap(color => {
      if (_.isString(color)) {
        return [[color, color]]
      }
      return _.toPairs(color)
    }).fromPairs().value()
  }

  return _.mapValues(colors, (color) => {
    return findColor(colorPool, color)
  })
}
