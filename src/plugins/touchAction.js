import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('touchAction'), (value, modifier) => {
        return [
          `.${e(`touch-${modifier}`)}`,
          {
            'touch-action': Array.isArray(value) ? value.join(' ') : value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('touchAction'))
  }
}
