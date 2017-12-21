import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ textSizes, naming: { textSizes: ns } }) {
  return _.map(textSizes, (size, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      'font-size': `${size}`,
    })
  })
}
