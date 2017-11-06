import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function sizedBorder(width, modifier) {
  modifier = modifier === 'default' ? '' : `-${modifier}`

  return defineClasses({
    [`border${modifier}`]: {
      'border-width': `${width}`,
    },
    [`border-t${modifier}`]: {
      'border-top-width': `${width}`,
    },
    [`border-r${modifier}`]: {
      'border-right-width': `${width}`,
    },
    [`border-b${modifier}`]: {
      'border-bottom-width': `${width}`,
    },
    [`border-l${modifier}`]: {
      'border-left-width': `${width}`,
    },
  })
}

module.exports = function({ borderWidths }) {
  return _.flatMap(borderWidths, sizedBorder)
}
