import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ transitionTimingFunction }) {
  return _.map(transitionTimingFunction, (func, modifier) => {
    return defineClass(modifier === 'default' ? 'transition' : `transition-${modifier}`, {
      'transition-timing-function': func,
    })
  })
}
