import _ from 'lodash'
import nameClass from '../util/nameClass'
import { asLength } from '../util/pluginUtils'
import isPlainObject from '../util/isPlainObject'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
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
    } else {
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
}
