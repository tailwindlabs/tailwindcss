import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('minWidth'), (value, modifier) => {
        return [
          `.${e(`min-w-${modifier}`)}`,
          {
            'min-width': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.minWidth'))
  }
}
