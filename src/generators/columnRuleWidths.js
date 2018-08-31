import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ columnRuleWidths }) {
  return _.map(columnRuleWidths, (width, modifier) => {
    return defineClass(modifier === 'default' ? 'col-rule' : `col-rule-${modifier}`, {
      'column-rule-width': width,
    })
  })
}
