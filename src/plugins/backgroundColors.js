import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e, config }) {
    const backgroundColors = _.isUndefined(values) ? config('theme.colors') : values
    const utilities = _.fromPairs(
      _.map(backgroundColors, (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
