import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.maxHeight'), (value, modifier) => {
        return [
          `.${e(`max-h-${modifier}`)}`,
          {
            'max-height': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.maxHeight'))
  }
}
