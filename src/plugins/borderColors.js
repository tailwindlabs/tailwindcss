import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e, config }) {
    const borderColors = _.isUndefined(values) ? config('theme.colors') : values
    const utilities = _.fromPairs(
      _.map(_.omit(borderColors, 'default'), (value, modifier) => {
        return [
          `.${e(`border-${modifier}`)}`,
          {
            'border-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants)
  }
}
