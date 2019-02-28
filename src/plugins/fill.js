import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.fill'), (value, modifier) => {
        return [
          `.${e(`fill-${modifier}`)}`,
          {
            fill: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.fill'))
  }
}
