const _ = require('lodash')

module.exports = function findColor(colors, color) {
  return _.get(colors, color, color)
}
