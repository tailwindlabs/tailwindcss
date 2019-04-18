import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('flex'), (value, modifier) => {
        return [
          `.${e(`flex-${modifier}`)}`,
          {
            flex: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('flex'))
  }
}
