import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('maxWidth'), (value, modifier) => {
        return [
          `.${e(`max-w-${modifier}`)}`,
          {
            'max-width': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('maxWidth'))
  }
}
