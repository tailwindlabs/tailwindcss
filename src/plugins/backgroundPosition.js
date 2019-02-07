import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('backgroundPosition'), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-position': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('modules.backgroundPosition'))
  }
}
