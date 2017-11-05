import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from './escapeClassName'

export default function(className, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: `${property}`,
      value: `${value}`,
    })
  })

  return postcss
    .rule({
      selector: `.${escapeClassName(className)}`,
    })
    .append(decls)
}
