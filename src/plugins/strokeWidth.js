import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('strokeWidth'), (value, modifier) => {
        return [
          `.${e(`stroke-${modifier}`)}`,
          {
            strokeWidth: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('strokeWidth'))
  }
}
