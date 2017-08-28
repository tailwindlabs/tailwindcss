import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ text }) {
  return _.map(text.leading, (value, modifier) => {
    return defineClass(`leading-${modifier}`, {
      'line-height': `${value}`,
    })
  })
}
