import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({shadows}) {
  return _.map(shadows, (shadow, className) => {
    return defineClass(`shadow-${className}`, {
      boxShadow: shadow,
    })
  })
}
