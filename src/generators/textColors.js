import _ from 'lodash'
import defineClass from '../util/defineClass'
import normalizeColorList from '../util/normalizeColorList'

export default function ({ colors, text }) {
  return _.map(normalizeColorList(text.colors, colors), (color, modifier) => {
    return defineClass(`text-${modifier}`, {
      'color': color,
    })
  })
}
