import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMinWidths(widths, ns) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifer}`, {
      'min-width': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMinWidths(config.minWidth, config.naming.minWidth)])
}
