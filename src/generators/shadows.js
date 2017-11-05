import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ shadows }) {
  return _.map(shadows, (shadow, modifier) => {
    return defineClass(modifier === 'default' ? 'shadow' : `shadow-${modifier}`, {
      'box-shadow': shadow,
    })
  })
}
