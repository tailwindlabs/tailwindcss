import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('backgroundSize'), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-size': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.opacity'))
  }
}
