import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ svgFill, naming: { svgFill: ns } }) {
  return _.map(svgFill, (color, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      fill: color,
    })
  })
}
