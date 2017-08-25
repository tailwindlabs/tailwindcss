const _ = require('lodash')
const defineClass = require('./define-class')

module.exports = function defineClasses(classes) {
  return _(classes).toPairs().map(([className, properties]) => {
    return defineClass(className, properties)
  }).value()
}
