import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('fontSize'), (value, modifier) => {
        const [fontSize, options] = Array.isArray(value) ? value : [value]
        const { lineHeight, letterSpacing } = _.isPlainObject(options)
          ? options
          : {
              lineHeight: options,
            }

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
