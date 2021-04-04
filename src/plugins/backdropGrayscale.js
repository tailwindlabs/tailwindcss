import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-grayscale': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropGrayscale)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-grayscale', modifier)]: {
              '--tw-backdrop-grayscale': `grayscale(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropGrayscale'), (value, modifier) => {
          return [
            nameClass('backdrop-grayscale', modifier),
            {
              '--tw-backdrop-grayscale': Array.isArray(value)
                ? value.map((v) => `grayscale(${v})`).join(' ')
                : `grayscale(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropGrayscale'))
    }
  }
}
