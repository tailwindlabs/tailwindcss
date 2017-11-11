import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function sizedBorder(radius, modifier) {
  modifier = modifier === 'default' ? '' : `-${modifier}`

  return defineClasses({
    [`rounded${modifier}`]: {
      'border-radius': `${radius}`,
    },
    [`rounded-t${modifier}`]: {
      'border-top-right-radius': `${radius}`,
      'border-top-left-radius': `${radius}`,
    },
    [`rounded-r${modifier}`]: {
      'border-top-right-radius': `${radius}`,
      'border-bottom-right-radius': `${radius}`,
    },
    [`rounded-b${modifier}`]: {
      'border-bottom-right-radius': `${radius}`,
      'border-bottom-left-radius': `${radius}`,
    },
    [`rounded-l${modifier}`]: {
      'border-top-left-radius': `${radius}`,
      'border-bottom-left-radius': `${radius}`,
    },
  })
}

module.exports = function({ borderRadius }) {
  return _.flatMap(borderRadius, sizedBorder)
}
