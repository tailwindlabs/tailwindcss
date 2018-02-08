import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ transitionDuration }) {
  return _.map(transitionDuration, (duration, modifier) => {
    return defineClass(modifier === 'default' ? 'transition' : `transition-${modifier}`, {
      'transition-duration': duration,
    })
  })
}
