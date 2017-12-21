import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMinHeights(heights, ns) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifer}`, {
      'min-height': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMinHeights(config.minHeight, config.naming.minHeight)])
}
