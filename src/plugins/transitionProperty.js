import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('transitionProperty'), (value, modifier) => {
        return [
          `.${e(`transition-${modifier}`)}`,
          {
            transitionProperty: value,
            transitionDuration: '250ms',
          },
        ]
      })
    )

    addUtilities(utilities, variants('transitionProperty'))
  }
}
