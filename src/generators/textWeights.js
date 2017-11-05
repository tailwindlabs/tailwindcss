import _ from 'lodash'
import defineClass from '../util/defineClass'
import hoverable from '../util/hoverable'

export default function({ fontWeights }) {
  return hoverable(
    _.map(fontWeights, (weight, modifier) => {
      return defineClass(`font-${modifier}`, {
        'font-weight': `${weight}`,
      })
    })
  )
}
