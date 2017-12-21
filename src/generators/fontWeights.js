import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ fontWeights, naming: { fontWeights: ns } }) {
  return _.map(fontWeights, (weight, modifier) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifier}`, {
      'font-weight': `${weight}`,
    })
  })
}
