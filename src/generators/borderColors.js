import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function({ borderColors }) {
  return hoverable(
    _.map(_.omit(borderColors, 'default'), (color, className) => {
      return defineClass(`border-${className}`, {
        'border-color': color
      })
    })
  )
}
