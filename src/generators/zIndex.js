import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ zIndex }) {
  return _.map(zIndex, (value, modifier) => {
    return defineClass(`z-${modifier}`, {
      'z-index': value,
    })
  })
}
