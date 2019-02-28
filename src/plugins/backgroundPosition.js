import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.backgroundPosition'), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-position': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.backgroundPosition'))
  }
}
