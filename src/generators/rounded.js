import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function sizedBorder(radius, modifier) {
  return defineClasses({
    [`radius-${modifier}`]: {
      'border-radius': `${radius}`,
    },
    [`radius-t-${modifier}`]: {
      'border-top-left-radius': `${radius}`,
      'border-top-right-radius': `${radius}`,
    },
    [`radius-r-${modifier}`]: {
      'border-top-right-radius': `${radius}`,
      'border-bottom-right-radius': `${radius}`,
    },
    [`radius-b-${modifier}`]: {
      'border-bottom-right-radius': `${radius}`,
      'border-bottom-left-radius': `${radius}`,
    },
    [`radius-l-${modifier}`]: {
      'border-top-left-radius': `${radius}`,
      'border-bottom-left-radius': `${radius}`,
    },
    [`radius-tl-${modifier}`]: {
      'border-top-left-radius': `${radius}`,
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
  })
}

module.exports = function({ borderRadius }) {
  return _.flatMap(borderRadius, sizedBorder)
}
