const _ = require('lodash')

module.exports = function findColor(colors, color) {
  const colorsNormalized = _.mapKeys(colors, (value, key) => {
    return _.camelCase(key)
  })

  return _.get(colorsNormalized, _.camelCase(color), color)
}
