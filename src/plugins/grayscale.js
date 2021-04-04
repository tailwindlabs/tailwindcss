import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        grayscale: (modifier, { theme }) => {
          let value = asValue(modifier, theme.grayscale)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('grayscale', modifier)]: { '--tw-grayscale': `grayscale(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('grayscale'), (value, modifier) => {
          return [
            nameClass('grayscale', modifier),
            {
              '--tw-grayscale': Array.isArray(value)
                ? value.map((v) => `grayscale(${v})`).join(' ')
                : `grayscale(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('grayscale'))
    }
  }
}
