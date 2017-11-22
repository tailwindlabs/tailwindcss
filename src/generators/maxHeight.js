import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineMaxHeights(heights) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`max-h-${modifer}`, {
      'max-height': `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineMaxHeights(config.maxHeight)])
}
