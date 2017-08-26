const _ = require('lodash')
const postcss = require('postcss')

module.exports = function defineClass(className, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: _.kebabCase(property),
      value: _.kebabCase(value),
    })
  })

  return postcss
    .rule({
      selector: `.${_.kebabCase(className)}`,
    })
    .append(decls)
}
