import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function ({ colors, text }) {
  return hoverable(_.map(text.colors, (color, modifier) => {
    return defineClass(`text-${modifier}`, {
      'color': color,
    })
  }))
}
