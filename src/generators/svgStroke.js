import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ svgStroke, naming: { svgStroke: ns } }) {
  return _.map(svgStroke, (color, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      stroke: color,
    })
  })
}
