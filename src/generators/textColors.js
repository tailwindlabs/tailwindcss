import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ textColors }) {
  return _.map(textColors, (color, modifier) => {
    return defineClass(`text-${modifier}`, {
      color,
    })
  })
}
