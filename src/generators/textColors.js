import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function({ textColors }) {
  return hoverable(
    _.map(textColors, (color, modifier) => {
      return defineClass(`text-${modifier}`, {
        color
      })
    })
  )
}
