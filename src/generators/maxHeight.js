import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMaxHeights(heights, ns) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifer}`, {
      'max-height': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMaxHeights(config.maxHeight, config.naming.maxHeight)])
}
