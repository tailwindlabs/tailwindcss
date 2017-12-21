import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineWidths(widths, ns) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifer}`, {
      width: `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineWidths(config.width, config.naming.width)])
}
