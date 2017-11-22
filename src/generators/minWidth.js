import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMinWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`min-w-${modifer}`, {
      'min-width': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMinWidths(config.minWidth)])
}
