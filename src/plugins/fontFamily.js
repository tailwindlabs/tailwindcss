import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('fontFamily'), (value, modifier) => {
        return [
          `.${e(`font-${modifier}`)}`,
          {
            'font-family': Array.isArray(value) ? value.join(', ') : value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('fontFamily'))
  }
}
