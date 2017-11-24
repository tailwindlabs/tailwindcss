import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineHeights(heights) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`h-${modifer}`, {
      height: `${size}`,
    })
  })
}

export default function(config) {
  return _.flatten([defineHeights(config.height)])
}
