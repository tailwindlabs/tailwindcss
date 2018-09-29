import _ from 'lodash'
import defineClasses from '../util/defineClasses'

function defineBorderStyleUtilities(borderStyles) {
  const generators = [
    style =>
      defineClasses({
        [`border-${style}`]: {
          'border-style': `${style}`,
        },
      }),
    style =>
      defineClasses({
        [`border-t-${style}`]: {
          'border-top-style': `${style}`,
        },
        [`border-r-${style}`]: {
          'border-right-style': `${style}`,
        },
        [`border-b-${style}`]: {
          'border-bottom-style': `${style}`,
        },
        [`border-l-${style}`]: {
          'border-left-style': `${style}`,
        },
      }),
  ]

  return _.flatMap(generators, generator => {
    return _.flatMap(borderStyles, generator)
  })
}

export default function() {
  const borderStyles = ['solid', 'dashed', 'dotted', 'none']
  return defineBorderStyleUtilities(borderStyles)
}
