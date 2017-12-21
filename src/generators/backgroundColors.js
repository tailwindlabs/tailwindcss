import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ backgroundColors, naming: { backgroundColors: ns } }) {
  return _.map(backgroundColors, (color, className) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${className}`, {
      'background-color': color,
    })
  })
}
