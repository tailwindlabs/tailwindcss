import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-blur': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropBlur)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-blur', modifier)]: { '--tw-backdrop-blur': `blur(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropBlur'), (value, modifier) => {
          return [
            nameClass('backdrop-blur', modifier),
            {
              '--tw-backdrop-blur': Array.isArray(value)
                ? value.map((v) => `blur(${v})`).join(' ')
                : `blur(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdopBlur'))
    }
  }
}
