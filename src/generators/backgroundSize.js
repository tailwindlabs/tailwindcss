import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ backgroundSize }) {
  return _.map(backgroundSize, (size, className) => {
    return defineClass(`bg-${className}`, {
      'background-size': size,
    })
  })
}
