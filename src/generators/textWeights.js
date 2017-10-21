import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function ({ text }) {
  return hoverable(_.map(text.weights, (weight, modifier) => {
    return defineClass(`font-${modifier}`, {
      'font-weight': `${weight}`,
    })
  }))
}
