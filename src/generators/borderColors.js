import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function ({ colors, borders }) {
  return hoverable(_.map(_.omit(borders.colors, 'default'), (color, className) => {
    return defineClass(`border-${className}`, {
      'border-color': color,
    })
  }))
}
