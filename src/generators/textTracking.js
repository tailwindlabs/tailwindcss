import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ tracking }) {
  return _.map(tracking, (value, modifier) => {
    return defineClass(`tracking-${modifier}`, {
      'letter-spacing': `${value}`,
    })
  })
}
