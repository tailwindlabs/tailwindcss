import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ svgStroke }) {
  return _.map(svgStroke, (color, modifier) => {
    return defineClass(`stroke-${modifier}`, {
      stroke: color,
    })
  })
}
