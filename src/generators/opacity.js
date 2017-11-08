import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ opacity }) {
  return _.map(opacity, (value, modifier) => {
    return defineClass(`opacity-${modifier}`, {
      opacity: value,
    })
  })
}
