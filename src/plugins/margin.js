import _ from 'lodash'

export default function() {
  return function({ addUtilities, className, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [className('m', modifier)]: { margin: `${size}` },
      }),
      (size, modifier) => ({
        [className('my', modifier)]: {
          'margin-top': `${size}`,
          'margin-bottom': `${size}`,
        },
        [className('mx', modifier)]: {
          'margin-left': `${size}`,
          'margin-right': `${size}`,
        },
      }),
      (size, modifier) => ({
        [className('mt', modifier)]: { 'margin-top': `${size}` },
        [className('mr', modifier)]: { 'margin-right': `${size}` },
        [className('mb', modifier)]: { 'margin-bottom': `${size}` },
        [className('ml', modifier)]: { 'margin-left': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('margin'), generator)
    })

    addUtilities(utilities, variants('margin'))
  }
}
