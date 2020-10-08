import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('outline'), (value, modifier) => {
        const [outline, outlineOffset = '0'] = Array.isArray(value) ? value : [value]

        return [
          `.${e(`outline-${modifier}`)}`,
          {
            outline,
            outlineOffset,
          },
        ]
      })
    )

    addUtilities(utilities, variants('outline'))
  }
}
