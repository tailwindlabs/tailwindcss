import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(config('theme.backgroundColor'), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.backgroundColor'))
  }
}
