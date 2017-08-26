import _ from 'lodash'
import defineClass from '../util/defineClass'
import normalizeColorList from '../util/normalizeColorList'

export default function ({ colors, backgroundColors }) {
  backgroundColors = normalizeColorList(backgroundColors, colors)

  return _(backgroundColors).toPairs().map(([className, color]) => {
    return defineClass(`bg-${className}`, {
      backgroundColor: color,
    })
  }).value()
}
