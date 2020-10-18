import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [nameClass('inset', modifier)]: {
          top: `${size}`,
          right: `${size}`,
          bottom: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [nameClass('inset-y', modifier)]: {
          top: `${size}`,
          bottom: `${size}`,
        },
        [nameClass('inset-x', modifier)]: {
          right: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [nameClass('top', modifier)]: { top: `${size}` },
        [nameClass('right', modifier)]: { right: `${size}` },
        [nameClass('bottom', modifier)]: { bottom: `${size}` },
        [nameClass('left', modifier)]: { left: `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, (generator) => {
      return _.flatMap(theme('inset'), generator)
    })

    addUtilities(utilities, variants('inset'))
  }
}
