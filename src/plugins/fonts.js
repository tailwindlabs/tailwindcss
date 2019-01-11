import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('fonts'), (value, modifier) => {
        return [
          `.${e(`font-${modifier}`)}`,
          {
            'font-family': _.isArray(value) ? value.join(', ') : value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.fonts'))
  }
}
