import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ shadows, naming: { shadow: ns } }) {
  return _.map(shadows, (shadow, modifier) => {
    return defineClass(
      modifier === 'default' ? ns.base : `${ns.base}${ns.modifierPrefix}${modifier}`,
      {
        'box-shadow': shadow,
      }
    )
  })
}
