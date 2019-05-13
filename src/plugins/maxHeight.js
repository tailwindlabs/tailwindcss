import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('maxHeight'), (value, modifier) => {
        return [
          `.${e(`max-h-${modifier}`)}`,
          {
            'max-height': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('maxHeight'))
  }
}
