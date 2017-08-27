import _ from 'lodash'
import defineClass from '../util/defineClass'
import normalizeColorList from '../util/normalizeColorList'

export default function ({ colors, borders }) {
  const borderColors = normalizeColorList(borders.colors, colors)

  return _.map(borderColors, (color, className) => {
    return defineClass(`border-${className}`, {
      'border-color': color,
    })
  })
}
