const { asLength, nameClass } = require('../pluginUtils')
const { isPlainObject } = require('../lib/utils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    text: (modifier, { theme }) => {
      let value = theme.fontSize[modifier]

      if (value === undefined) {
        value = asLength(modifier, {})

        return value === undefined
          ? []
          : {
              [nameClass('text', modifier)]: {
                'font-size': value,
              },
            }
      }

      let [fontSize, options] = Array.isArray(value) ? value : [value]
      let { lineHeight, letterSpacing } = isPlainObject(options)
        ? options
        : {
            lineHeight: options,
          }

      return {
        [nameClass('text', modifier)]: {
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
      }
    },
  })
}
