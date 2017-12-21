import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ borderColors, naming: { borderColors: ns } }) {
  return _.map(_.omit(borderColors, 'default'), (color, className) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${className}`, {
      'border-color': color,
    })
  })
}
