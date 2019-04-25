import _ from 'lodash'

export default function() {
  return function({ addUtilities, className, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [className('inset', modifier)]: {
          top: `${size}`,
          right: `${size}`,
          bottom: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [className('inset-y', modifier)]: { top: `${size}`, bottom: `${size}` },
        [className('inset-x', modifier)]: { right: `${size}`, left: `${size}` },
      }),
      (size, modifier) => ({
        [className('top', modifier)]: { top: `${size}` },
        [className('right', modifier)]: { right: `${size}` },
        [className('bottom', modifier)]: { bottom: `${size}` },
        [className('left', modifier)]: { left: `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('inset'), generator)
    })

    addUtilities(utilities, variants('inset'))
  }
}
