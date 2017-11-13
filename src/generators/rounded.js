import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function sizedBorder(radius, modifier) {
  return defineClasses({
    [`radius-${modifier}`]: {
      'border-radius': `${radius}`,
    },
    [`radius-tr-${modifier}`]: {
      'border-top-right-radius': `${radius}`,
    },
    [`radius-br-${modifier}`]: {
      'border-bottom-right-radius': `${radius}`,
    },
    [`radius-bl-${modifier}`]: {
      'border-bottom-left-radius': `${radius}`,
    },
    [`radius-tl-${modifier}`]: {
      'border-top-left-radius': `${radius}`,
    },
  })
}

module.exports = function({ borderRadius }) {
  return _.flatMap(borderRadius, sizedBorder)
}
