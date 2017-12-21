import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ opacity, naming: { opacity: ns } }) {
  return _.map(opacity, (value, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      opacity: value,
    })
  })
}
