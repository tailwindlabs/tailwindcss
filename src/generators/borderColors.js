import _ from 'lodash'
import defineClass from '../util/defineClass'
import normalizeColorList from '../util/normalizeColorList'
import hoverable from '../util/hoverable'

export default function ({ colors, borders }) {
  const borderColors = normalizeColorList(borders.colors, colors)

  return hoverable(_.map(borderColors, (color, className) => {
    return defineClass(`border-${className}`, {
      'border-color': color,
    })
  }))
}
