import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineBorderRadiusUtilities(borderRadiuses) {
  const generators = [
    (radius, modifier) =>
      defineClasses({
        [`rounded${modifier}`]: {
          'border-radius': `${radius}`,
        },
      }),
    (radius, modifier) =>
      defineClasses({
        [`rounded-t${modifier}`]: {
          'border-top-left-radius': `${radius}`,
          'border-top-right-radius': `${radius}`,
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
      }),
    (radius, modifier) =>
      defineClasses({
        [`rounded-tl${modifier}`]: {
          'border-top-left-radius': `${radius}`,
        },
        [`rounded-tr${modifier}`]: {
          'border-top-right-radius': `${radius}`,
        },
        [`rounded-br${modifier}`]: {
          'border-bottom-right-radius': `${radius}`,
        },
        [`rounded-bl${modifier}`]: {
          'border-bottom-left-radius': `${radius}`,
        },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(borderRadiuses, (radius, modifier) => {
      return generator(radius, modifier === 'default' ? '' : `-${modifier}`)
    })
  })
}

module.exports = function({ borderRadius }) {
  return defineBorderRadiusUtilities(borderRadius)
}
