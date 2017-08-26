const _ = require('lodash')
const defineClass = require('../util/defineClass')

module.exports = function ({ shadows }) {
  return _(shadows).toPairs().map(([className, shadow]) => {
    return defineClass(`shadow-${className}`, {
        boxShadow: shadow,
    })
  }).value()
}
