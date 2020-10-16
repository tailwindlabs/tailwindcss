import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('fontSize'), (value, modifier) => {
        const [fontSize, options] = Array.isArray(value) ? value : [value]
        const { lineHeight, letterSpacing } = _.isPlainObject(options)
          ? options
          : {
              lineHeight: options,
            }

        return [
          nameClass('text', modifier),
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
