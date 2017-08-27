import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function ({ constrain }) {
  return _.map(constrain, (size, className) => {
    return defineClass(`constrain-${className}`, {
      maxWidth: size,
    })
  })
}
