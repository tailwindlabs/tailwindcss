import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, variants }) {
    const utilities = _.fromPairs(
      _.map(config('theme.zIndex'), (value, modifier) => {
        return [
          `.z-${modifier}`,
          {
            'z-index': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('zIndex'))
  }
}
