import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('order'), (value, modifier) => {
        return [
          `.${e(`order-${modifier}`)}`,
          {
            order: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('order'))
  }
}
