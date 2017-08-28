import _ from 'lodash'
import postcss from 'postcss'

function escapeSelector(selector) {
    return selector.replace(/([^A-Za-z0-9\-])/g, "\\$1")
}

export default function(className, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: `${property}`,
      value: `${value}`,
    })
  })

  return postcss.rule({
    selector: `.${escapeSelector(className)}`,
  }).append(decls)
}
