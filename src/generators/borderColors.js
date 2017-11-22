import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ borderColors }) {
  return _.map(_.omit(borderColors, 'default'), (color, className) => {
    return defineClass(`border-${className}`, {
      'border-color': color,
    })
  })
}
