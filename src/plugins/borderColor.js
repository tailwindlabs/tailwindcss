import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(_.omit(config('theme.borderColor'), 'default'), (value, modifier) => {
        return [
          `.${e(`border-${modifier}`)}`,
          {
            'border-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.borderColor'))
  }
}
