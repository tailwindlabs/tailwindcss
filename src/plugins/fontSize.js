import isPlainObject from '../util/isPlainObject'

export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        text: (value) => {
          let [fontSize, options] = Array.isArray(value) ? value : [value]
          let { lineHeight, letterSpacing } = isPlainObject(options)
            ? options
            : { lineHeight: options }

          return {
            'font-size': fontSize,
            ...(lineHeight === undefined ? {} : { 'line-height': lineHeight }),
            ...(letterSpacing === undefined ? {} : { 'letter-spacing': letterSpacing }),
          }
        },
      },
      {
        values: theme('fontSize'),
        variants: variants('fontSize'),
        type: 'length',
      }
    )
  }
}
