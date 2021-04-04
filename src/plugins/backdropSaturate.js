import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-saturate': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropSaturate)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-saturate', modifier)]: {
              '--tw-backdrop-saturate': `saturate(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropSaturate'), (value, modifier) => {
          return [
            nameClass('backdrop-saturate', modifier),
            {
              '--tw-backdrop-saturate': Array.isArray(value)
                ? value.map((v) => `saturate(${v})`).join(' ')
                : `saturate(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropSaturate'))
    }
  }
}
