import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.width'), (value, modifier) => {
        return [
          `.${e(`w-${modifier}`)}`,
          {
            width: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.width'))
  }
}
