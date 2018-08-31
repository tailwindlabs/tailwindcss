import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ columnRuleColors }) {
  return _.map(columnRuleColors, (color, className) => {
    return defineClass(`col-${className}`, {
      'column-rule-color': color,
    })
  })
}
