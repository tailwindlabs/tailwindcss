import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
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
}
