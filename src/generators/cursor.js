import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ cursor }) {
  return _.map(cursor, (value, modifier) => {
    return defineClass(`cursor-${modifier}`, {
      cursor: value,
    })
  })
}
