import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ textSizes }) {
  return _.map(textSizes, (size, modifier) => {
    return defineClass(`text-${modifier}`, {
      'font-size': `${size}`,
    })
  })
}
