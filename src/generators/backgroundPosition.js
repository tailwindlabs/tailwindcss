import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ backgroundPosition }) {
  return _.map(backgroundPosition, (position, className) => {
    return defineClass(`bg-${className}`, {
      'background-position': position,
    })
  })
}
