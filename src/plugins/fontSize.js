import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('fontSize'), (value, modifier) => {
        return [
          `.${e(`text-${modifier}`)}`,
          {
            'font-size': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('fontSize'))
  }
}
