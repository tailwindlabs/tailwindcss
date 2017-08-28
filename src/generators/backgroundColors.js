import _ from 'lodash'
import defineClass from '../util/defineClass'
import normalizeColorList from '../util/normalizeColorList'
import hoverable from '../util/hoverable'

export default function ({ colors, backgrounds }) {
  return hoverable(_.map(normalizeColorList(backgrounds.colors, colors), (color, className) => {
    return defineClass(`bg-${className}`, {
      'background-color': color,
    })
  }))
}
