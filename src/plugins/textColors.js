import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e, config }) {
    const textColors = _.isUndefined(values) ? config('theme.colors') : values
    const utilities = _.fromPairs(
      _.map(textColors, (value, modifier) => {
        return [
          `.${e(`text-${modifier}`)}`,
          {
            color: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
