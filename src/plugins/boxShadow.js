import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.boxShadow'), (value, modifier) => {
        const className = modifier === 'default' ? 'shadow' : `shadow-${modifier}`
        return [
          `.${e(className)}`,
          {
            'box-shadow': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.boxShadow'))
  }
}
