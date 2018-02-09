import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ transitionDelay }) {
  return _.map(transitionDelay, (delay, modifier) => {
    return defineClass(modifier === 'default' ? 'trans-delay' : `trans-delay-${modifier}`, {
      'transition-delay': delay,
    })
  })
}
