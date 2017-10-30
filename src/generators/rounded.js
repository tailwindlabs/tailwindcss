import _ from 'lodash'
import defineClass from '../util/defineClass'
import defineClasses from '../util/defineClasses'

function sideVariants() {
  return defineClasses({
    'rounded-t': {
      'border-bottom-right-radius': '0',
      'border-bottom-left-radius': '0',
    },
    'rounded-r': {
      'border-bottom-left-radius': '0',
      'border-top-left-radius': '0',
    },
    'rounded-b': {
      'border-top-left-radius': '0',
      'border-top-right-radius': '0',
    },
    'rounded-l': {
      'border-top-right-radius': '0',
      'border-bottom-right-radius': '0',
    },
  })
}

module.exports = function({ borderRadius }) {
  return _(borderRadius).map((radius, modifier) => {
    return defineClass(modifier === 'default' ? 'rounded' : `rounded-${modifier}`, {
      'border-radius': radius,
    })
  }).concat(sideVariants()).value()
}
