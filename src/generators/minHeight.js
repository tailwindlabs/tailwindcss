import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMinHeights(heights) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`min-h-${modifer}`, {
      'min-height': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMinHeights(config.minHeight)])
}
