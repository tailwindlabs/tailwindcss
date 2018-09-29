import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineBorderColorUtilities(borderColors) {
  const generators = [
    (color, className) =>
      defineClasses({
        [`border-${className}`]: {
          'border-color': `${color}`,
        },
      }),
    (color, className) =>
      defineClasses({
        [`border-t-${className}`]: {
          'border-top-color': `${color}`,
        },
        [`border-r-${className}`]: {
          'border-right-color': `${color}`,
        },
        [`border-b-${className}`]: {
          'border-bottom-color': `${color}`,
        },
        [`border-l-${className}`]: {
          'border-left-width': `${color}`,
        },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(_.omit(borderColors, 'default'), generator)
  })
}

export default function({ borderColors }) {
  return defineBorderColorUtilities(borderColors)
}
