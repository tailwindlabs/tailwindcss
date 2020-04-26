import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
    target(
      {
        ie11: () => {},
      },
      () => {
        const utilities = _.fromPairs(
          _.map(theme('objectPosition'), (value, modifier) => {
            return [
              `.${e(`object-${modifier}`)}`,
              {
                'object-position': value,
              },
            ]
          })
        )

        addUtilities(utilities, variants('objectPosition'))
      }
    )
  }
}
