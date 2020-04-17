import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('fontSize'), (value, modifier) => {
        const [fontSize, lineHeight] = Array.isArray(value) ? value : [value]

        return [
          `.${e(`text-${modifier}`)}`,
          {
            'font-size': fontSize,
            ...(lineHeight === undefined
              ? {}
              : {
                  'line-height': lineHeight,
                }),
          },
        ]
      })
    )

    addUtilities(utilities, variants('fontSize'))
  }
}
