import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMaxWidths(widths, ns) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifer}`, {
      'max-width': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMaxWidths(config.maxWidth, config.naming.maxWidth)])
}
