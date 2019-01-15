import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('shadows'), (value, modifier) => {
        const className = modifier === 'default' ? 'shadow' : `shadow-${modifier}`
        return [
          `.${e(className)}`,
          {
            'box-shadow': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.shadows'))
  }
}
