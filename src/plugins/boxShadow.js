import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('boxShadow'), (value, modifier) => {
        const className = modifier === 'default' ? 'shadow' : `shadow-${modifier}`
        return [
          `.${e(className)}`,
          {
            'box-shadow': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('boxShadow'))
  }
}
