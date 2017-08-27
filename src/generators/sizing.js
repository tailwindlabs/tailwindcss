import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`w-${modifer}`, {
      'width': `${size}`,
    })
  })
}

function defineHeights(heights) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`h-${modifer}`, {
      'height': `${size}`,
    })
  })
}

export default function ({ sizing }) {
  const widths = _.merge({}, sizing.common, sizing.width)
  const heights = _.merge({}, sizing.common, sizing.height)
  return _.flatten([
    defineWidths(widths),
    defineHeights(heights),
  ])
}
