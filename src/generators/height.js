import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineHeights(heights, ns) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`${ns.base}${ns.modifierPrefix}${modifer}`, {
      height: `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineHeights(config.height, config.naming.height)])
}
