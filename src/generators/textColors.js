import _ from 'lodash'
import defineClass from '../util/defineClass'
import normalizeColorList from '../util/normalizeColorList'
import hoverable from '../util/hoverable'

export default function ({ colors, text }) {
  return hoverable(_.map(normalizeColorList(text.colors, colors), (color, modifier) => {
    return defineClass(`text-${modifier}`, {
      'color': color,
    })
  }))
}
