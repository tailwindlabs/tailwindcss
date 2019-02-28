import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.minHeight'), (value, modifier) => {
        return [
          `.${e(`min-h-${modifier}`)}`,
          {
            'min-height': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.minHeight'))
  }
}
