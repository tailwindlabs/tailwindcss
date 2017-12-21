import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ leading, naming: { leading: ns } }) {
  return _.map(leading, (value, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      'line-height': `${value}`,
    })
  })
}
