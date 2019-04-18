import _ from 'lodash'

export default function() {
  return function({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('zIndex'), (value, modifier) => {
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
