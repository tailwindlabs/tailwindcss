import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ zIndex, naming: { zIndex: ns } }) {
  return _.map(zIndex, (value, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      'z-index': value,
    })
  })
}
