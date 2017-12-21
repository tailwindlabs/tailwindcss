import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ textColors, naming: { textColors: ns } }) {
  return _.map(textColors, (color, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      color,
    })
  })
}
