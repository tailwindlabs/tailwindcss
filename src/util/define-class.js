const _ = require('lodash')
const postcss = require('postcss')

module.exports = function defineClass(className, properties) {
  const kebabClass = _.kebabCase(className)
  const decls = _(properties).toPairs().map(([property, value]) => {
    return postcss.decl({
      prop: _.kebabCase(property),
      value: value,
    })
  }).value()

  return postcss.rule({
    selector: `.${kebabClass}`
  }).append(decls)
}
