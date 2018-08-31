import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ columnCount }) {
  return _.map(columnCount, (value, modifier) => {
    return defineClass(`col-${modifier}`, {
      'column-count': `${value}`,
    })
  })
}
