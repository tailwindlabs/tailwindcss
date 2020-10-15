import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backgroundImage'), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-image': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backgroundImage'))
  }
}
