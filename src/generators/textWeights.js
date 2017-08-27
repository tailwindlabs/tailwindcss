import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ text }) {
  return _.map(text.weights, (weight, modifier) => {
    return defineClass(`text-${modifier}`, {
      'font-weight': `${weight}`,
    })
  })
}
