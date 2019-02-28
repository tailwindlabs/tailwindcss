import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.stroke'), (value, modifier) => {
        return [
          `.${e(`stroke-${modifier}`)}`,
          {
            stroke: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.stroke'))
  }
}
