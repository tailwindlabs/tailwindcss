import _ from 'lodash'
import defineClass from '../util/defineClass'
import normalizeColorList from '../util/normalizeColorList'

export default function ({ colors, backgroundColors }) {
  return _.map(normalizeColorList(backgroundColors, colors), (color, className) => {
    return defineClass(`bg-${className}`, {
      'background-color': color,
    })
  })
}
