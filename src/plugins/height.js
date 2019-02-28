import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.height'), (value, modifier) => {
        return [
          `.${e(`h-${modifier}`)}`,
          {
            height: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.height'))
  }
}
