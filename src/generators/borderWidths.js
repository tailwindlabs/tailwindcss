import _ from 'lodash'
import defineClass from '../util/defineClass'
import defineClasses from '../util/defineClasses'
import findColor from '../util/findColor'

function defaultBorder(width, color) {
  return defineClasses({
    border: {
      border: `${width} solid ${color}`,
    },
    borderT: {
      borderTop: `${width} solid ${color}`,
    },
    borderR: {
      borderRight: `${width} solid ${color}`,
    },
    borderB: {
      borderBottom: `${width} solid ${color}`,
    },
    borderL: {
      borderLeft: `${width} solid ${color}`,
    },
  })
}

function sizedBorder(size, width, color) {
  return defineClasses({
    [`border-${size}`]: {
      border: `${width} solid ${color}`,
    },
    [`border-t-${size}`]: {
      borderTop: `${width} solid ${color}`,
    },
    [`border-r-${size}`]: {
      borderRight: `${width} solid ${color}`,
    },
    [`border-b-${size}`]: {
      borderBottom: `${width} solid ${color}`,
    },
    [`border-l-${size}`]: {
      borderLeft: `${width} solid ${color}`,
    },
  })
}

module.exports = function({colors, borders}) {
  const color = findColor(colors, borders.defaults.color)

  return _.flatten([
    defaultBorder(borders.defaults.width, color),
    ..._.map(borders.widths, (width, size) => sizedBorder(size, width, color)),
  ])
}
