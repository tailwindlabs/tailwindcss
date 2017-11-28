import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ svgFill }) {
  return _.map(svgFill, (color, modifier) => {
    return defineClass(`fill-${modifier}`, {
      fill: color,
    })
  })
}
