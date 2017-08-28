import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defaultRounded(radius) {
  return defineClasses({
    'rounded': {
      'border-radius': `${radius}`,
    },
    'rounded-t': {
      'border-top-left-radius': `${radius}`,
      'border-top-right-radius': `${radius}`,
    },
    'rounded-r': {
      'border-top-right-radius': `${radius}`,
      'border-bottom-right-radius': `${radius}`,
    },
    'rounded-b': {
      'border-bottom-right-radius': `${radius}`,
      'border-bottom-left-radius': `${radius}`,
    },
    'rounded-l': {
      'border-bottom-left-radius': `${radius}`,
      'border-top-left-radius': `${radius}`,
    },
  })
}

function roundedVariant(modifier, radius) {
  return defineClasses({
    [`rounded-${modifier}`]: {
      'border-radius': `${radius}`,
    },
    [`rounded-t-${modifier}`]: {
      'border-top-left-radius': `${radius}`,
      'border-top-right-radius': `${radius}`,
    },
    [`rounded-r-${modifier}`]: {
      'border-top-right-radius': `${radius}`,
      'border-bottom-right-radius': `${radius}`,
    },
    [`rounded-b-${modifier}`]: {
      'border-bottom-right-radius': `${radius}`,
      'border-bottom-left-radius': `${radius}`,
    },
    [`rounded-l-${modifier}`]: {
      'border-bottom-left-radius': `${radius}`,
      'border-top-left-radius': `${radius}`,
    },
  })
}

module.exports = function({borders}) {
  return _.flatten([
    defaultRounded(borders.rounded.default),
    ..._.map(borders.rounded.modifiers, (radius, modifier) => roundedVariant(modifier, radius)),
  ])
}
