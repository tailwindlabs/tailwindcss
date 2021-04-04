import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        blur: (modifier, { theme }) => {
          let value = asValue(modifier, theme.blur)

          if (value === undefined) {
            return []
          }

          return { [nameClass('blur', modifier)]: { '--tw-blur': `blur(${value})` } }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('blur'), (value, modifier) => {
          return [
            nameClass('blur', modifier),
            {
              '--tw-blur': Array.isArray(value)
                ? value.map((v) => `blur(${v})`).join(' ')
                : `blur(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('blur'))
    }
  }
}
