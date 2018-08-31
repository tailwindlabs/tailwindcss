import _ from 'lodash'
import defineClass from '../util/defineClass'

export default function({ widths }) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`column-w-${modifer}`, {
      'column-width': `${size}`,
    })
  })
}
