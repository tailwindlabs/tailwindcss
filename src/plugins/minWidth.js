import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('minWidth'), (value, modifier) => {
        return [
          `.${e(`min-w-${modifier}`)}`,
          {
            'min-width': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('minWidth'))
  }
}
