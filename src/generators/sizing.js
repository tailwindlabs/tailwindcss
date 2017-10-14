import _ from 'lodash'
import defineClass from '../util/defineClass'

function defineWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`w-${modifer}`, {
      'width': `${size}`,
    })
  })
}

function defineMinWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`min-w-${modifer}`, {
      'min-width': `${size}`,
    })
  })
}

function defineMaxWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`max-w-${modifer}`, {
      'max-width': `${size}`,
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

function defineMinHeights(heights) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`min-h-${modifer}`, {
      'min-height': `${size}`,
    })
  })
}

function defineMaxHeights(heights) {
  return _.map(heights, (size, modifer) => {
    return defineClass(`max-h-${modifer}`, {
      'max-height': `${size}`,
    })
  })
}

export default function ({ sizing }) {
  return _.flatten([
    defineWidths(sizing.width),
    defineMinWidths(sizing.minWidth),
    defineMaxWidths(sizing.maxWidth),
    defineHeights(sizing.height),
    defineMinHeights(sizing.minHeight),
    defineMaxHeights(sizing.maxHeight),
  ])
}
