import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function ({ backgrounds }) {
  return hoverable(_.map(backgrounds.colors, (color, className) => {
    return defineClass(`bg-${className}`, {
      'background-color': color,
    })
  }))
}
