import _ from 'lodash'
import postcss from 'postcss'

export default function(className, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: _.kebabCase(property),
      value: value,
    })
  })

  return postcss.rule({
    selector: `.${_.kebabCase(className)}`,
  }).append(decls)
}
