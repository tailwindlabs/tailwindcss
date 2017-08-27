import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ text }) {
  return _.map(text.sizes, (size, modifier) => {
    return defineClass(`text-${modifier}`, {
      'font-size': `${size}`,
    })
  })
}
