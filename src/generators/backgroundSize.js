import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ backgroundSizes }) {
  return _.map(backgroundSizes, (size, className) => {
    return defineClass(`bg-${className}`, {
      'background-size': size,
    })
  })
}
