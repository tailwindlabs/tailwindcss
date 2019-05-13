import _ from 'lodash'

export default function() {
  return function({ addUtilities, theme, variants, e }) {
    const utilities = _.fromPairs(
      _.map(theme('letterSpacing'), (value, modifier) => {
        return [
          `.${e(`tracking-${modifier}`)}`,
          {
            'letter-spacing': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('letterSpacing'))
  }
}
