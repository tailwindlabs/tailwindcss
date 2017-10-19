import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ text }) {
  return _.map(text.weights, (weight, modifier) => {
    return defineClass(`font-${modifier}`, {
      'font-weight': `${weight}`,
    })
  })
}
