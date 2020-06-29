import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('fontSize'), (value, modifier) => {
        const [fontSize, options] = Array.isArray(value) ? value : [value]
        // Tailwind 1.3+ syntax allowed line height to be specified in the array like
        // ['16px', '24px'], so we can get it from there as well as from object syntax
        const lineHeight = options instanceof Object ? options.lineHeight : options
        const letterSpacing = options && options.letterSpacing

        return [
          `.${e(`text-${modifier}`)}`,
          {
            'font-size': fontSize,
            ...(lineHeight === undefined
              ? {}
              : {
                  'line-height': lineHeight,
                }),
            ...(letterSpacing === undefined
              ? {}
              : {
                  'letter-spacing': letterSpacing,
                }),
          },
        ]
      })
    )

    addUtilities(utilities, variants('fontSize'))
  }
}
