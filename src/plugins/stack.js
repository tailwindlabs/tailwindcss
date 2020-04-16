import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(`stack-y-${modifier}`)} > * + *`]: { 'margin-top': `${size}` },
        [`.${e(`stack-x-${modifier}`)} > * + *`]: { 'margin-left': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('stack'), generator)
    })

    addUtilities(utilities, variants('stack'))
  }
}
