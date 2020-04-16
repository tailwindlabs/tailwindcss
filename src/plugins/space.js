import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(`space-y-${modifier}`)} > :not(:last-child)`]: { 'margin-bottom': `${size}` },
        [`.${e(`space-x-${modifier}`)} > :not(:last-child)`]: { 'margin-right': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('space'), generator)
    })

    addUtilities(utilities, variants('space'))
  }
}
