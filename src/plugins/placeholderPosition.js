import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('placeholderPosition'), (value, modifier) => {
        return [
          `.${e(`placeholder-${modifier}`)}::placeholder`,
          {
            'text-align': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('placeholderPosition'))
  }
}
