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
  return defineClasses({
    [`border-${size}`]: {
      'border': `${width} solid ${color}`,
    },
    [`border-t-${size}`]: {
      'border-top': `${width} solid ${color}`,
    },
    [`border-r-${size}`]: {
      'border-right': `${width} solid ${color}`,
    },
    [`border-b-${size}`]: {
      'border-bottom': `${width} solid ${color}`,
    },
    [`border-l-${size}`]: {
      'border-left': `${width} solid ${color}`,
    },
  })
}

module.exports = function({colors, borders}) {
  const color = borders.defaults.color

  return _.flatten([
    defaultBorder(borders.defaults.width, color),
    ..._.map(borders.widths, (width, size) => sizedBorder(size, width, color)),
  ])
}
