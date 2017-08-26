const postcss = require('postcss')
const _ = require('lodash')
const defineClass = require('./define-class')

module.exports = function defineClasses(classes) {
    let rules = _.map(classes, function(properties, className) {
        return defineClass(className, properties)
    })

    return rules
}
