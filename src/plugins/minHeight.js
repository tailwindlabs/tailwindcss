import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('minHeight'), (value, modifier) => {
        return [
          `.${e(`min-h-${modifier}`)}`,
          {
            'min-height': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('minHeight'))
  }
}
