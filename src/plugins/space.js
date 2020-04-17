import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(`space-y-${modifier}`)} > :not(template) ~ :not(template)`]: {
          'margin-top': `${size}`,
        },
        [`.${e(`space-x-${modifier}`)} > :not(template) ~ :not(template)`]: {
          'margin-left': `${size}`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('space'), generator)
    })

    addUtilities(utilities, variants('space'))
  }
}
