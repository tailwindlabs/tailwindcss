import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('inset', modifier))}`]: {
          top: `${size}`,
          right: `${size}`,
          bottom: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('inset-y', modifier))}`]: {
          top: `${size}`,
          bottom: `${size}`,
        },
        [`.${e(prefixNegativeModifiers('inset-x', modifier))}`]: {
          right: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('top', modifier))}`]: { top: `${size}` },
        [`.${e(prefixNegativeModifiers('right', modifier))}`]: { right: `${size}` },
        [`.${e(prefixNegativeModifiers('bottom', modifier))}`]: { bottom: `${size}` },
        [`.${e(prefixNegativeModifiers('left', modifier))}`]: { left: `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('inset'), generator)
    })

    addUtilities(utilities, variants('inset'))
  }
}
