import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.textColor'), (value, modifier) => {
        return [
          `.${e(`text-${modifier}`)}`,
          {
            color: value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.textColor'))
  }
}
