import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const shadows = config('classesNames').boxShadow

    const utilities = _.fromPairs(
      _.map(config('theme.boxShadow'), (value, modifier) => {
        const className = modifier === 'default' ? shadows : `${shadows}-${modifier}`
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
