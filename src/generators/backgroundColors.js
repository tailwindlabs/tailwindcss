import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function({ backgroundColors }) {
  return hoverable(
    _.map(backgroundColors, (color, className) => {
      return defineClass(`bg-${className}`, {
        'background-color': color
      })
    })
  )
}
