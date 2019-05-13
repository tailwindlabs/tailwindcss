import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('opacity'), (value, modifier) => {
        return [
          `.${e(`opacity-${modifier}`)}`,
          {
            opacity: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('opacity'))
  }
}
