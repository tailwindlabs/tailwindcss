import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ transitionProperty }) {
  return _.map(transitionProperty, (propery, modifier) => {
    return defineClass(modifier === 'default' ? 'trans' : `trans-${modifier}`, {
      'transition-property': propery,
    })
  })
}
