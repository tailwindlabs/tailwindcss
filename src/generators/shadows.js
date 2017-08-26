import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({shadows}) {
  return _(shadows)
    .toPairs()
    .map(([className, shadow]) => {
      return defineClass(`shadow-${className}`, {
        boxShadow: shadow,
      })
    })
    .value()
}
