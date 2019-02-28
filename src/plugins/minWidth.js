import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.minWidth'), (value, modifier) => {
        return [
          `.${e(`min-w-${modifier}`)}`,
          {
            'min-width': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.minWidth'))
  }
}
