import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
    if (target('placeholderOpacity') === 'ie11') {
      return
    }

    const utilities = _.fromPairs(
      _.map(theme('placeholderOpacity'), (value, modifier) => {
        return [
          `.${e(`placeholder-opacity-${modifier}`)}::placeholder`,
          {
            '--placeholder-opacity': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('placeholderOpacity'))
  }
}
