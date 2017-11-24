import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ backgroundColors }) {
  return _.map(backgroundColors, (color, className) => {
    return defineClass(`bg-${className}`, {
      'background-color': color,
    })
  })
}
