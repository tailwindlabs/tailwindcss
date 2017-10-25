import _ from 'lodash'
import defineClass from '../util/defineClass'
import defineClasses from '../util/defineClasses'

function defaultBorder(width, color) {
  return defineClasses({
    'border': {
      'border': `${width} solid ${color}`,
    },
    'border-t': {
      'border-top': `${width} solid ${color}`,
    },
    'border-r': {
      'border-right': `${width} solid ${color}`,
    },
    'border-b': {
      'border-bottom': `${width} solid ${color}`,
    },
    'border-l': {
      'border-left': `${width} solid ${color}`,
    },
  })
}

function sizedBorder(size, width, color) {
  const style = width == 0 ? '0' : `${width} solid ${color}`

  return defineClasses({
    [`border-${size}`]: {
      'border': `${style}`,
    },
    [`border-t-${size}`]: {
      'border-top': `${style}`,
    },
    [`border-r-${size}`]: {
      'border-right': `${style}`,
    },
    [`border-b-${size}`]: {
      'border-bottom': `${style}`,
    },
    [`border-l-${size}`]: {
      'border-left': `${style}`,
    },
  })
}

module.exports = function({ borderWidths, borderColors }) {
  const color = borderColors.default

  return _.flatten([
    defaultBorder(borderWidths.default, color),
    ..._.map(_.omit(borderWidths, 'default'), (width, size) => sizedBorder(size, width, color)),
  ])
}
