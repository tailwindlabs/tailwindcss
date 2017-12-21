import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ tracking, naming: { textTracking: ns } }) {
  return _.map(tracking, (value, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      'letter-spacing': `${value}`,
    })
  })
}
