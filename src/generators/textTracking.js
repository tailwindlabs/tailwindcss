import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ text }) {
  return _.map(text.tracking, (value, modifier) => {
    return defineClass(`tracking-${modifier}`, {
      'letter-spacing': `${value}`,
    })
  })
}
