import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('size'), (value, modifier) => {
        return [
          `.${e(`size-${modifier}`)}`,
          {
            width: value,
            height: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('size'))
  }
}
