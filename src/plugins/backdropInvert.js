import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-invert': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropInvert)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-invert', modifier)]: {
              '--tw-backdrop-invert': `invert(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropInvert'), (value, modifier) => {
          return [
            nameClass('backdrop-invert', modifier),
            {
              '--tw-backdrop-invert': Array.isArray(value)
                ? value.map((v) => `invert(${v})`).join(' ')
                : `invert(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropInvert'))
    }
  }
}
