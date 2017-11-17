import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineBorderWidthUtilities(borderWidths) {
  const generators = [
    (width, modifier) =>
      defineClasses({
        [`border${modifier}`]: {
          'border-width': `${width}`,
        },
      }),
    (width, modifier) =>
      defineClasses({
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
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(borderWidths, (width, modifier) => {
      return generator(width, modifier === 'default' ? '' : `-${modifier}`)
    })
  })
}

module.exports = function({ borderWidths }) {
  return defineBorderWidthUtilities(borderWidths)
}
