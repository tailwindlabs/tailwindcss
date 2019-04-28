import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('textShadow'), (value, modifier) => {
        const className = modifier === 'default' ? 'text-shadow' : `text-shadow-${modifier}`
        return [
          `.${e(className)}`,
          {
            'text-shadow': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('textShadow'))
  }
}
