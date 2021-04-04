import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-brightness': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropBrightness)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-brightness', modifier)]: {
              '--tw-backdrop-brightness': `brightness(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropBrightness'), (value, modifier) => {
          return [
            nameClass('backdrop-brightness', modifier),
            {
              '--tw-backdrop-brightness': Array.isArray(value)
                ? value.map((v) => `brightness(${v})`).join(' ')
                : `brightness(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropBrightness'))
    }
  }
}
