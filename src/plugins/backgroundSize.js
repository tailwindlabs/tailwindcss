import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config, variants }) {
    const utilities = _.fromPairs(
      _.map(config('theme.backgroundSize'), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-size': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backgroundSize'))
  }
}
