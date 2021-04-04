import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        sepia: (modifier, { theme }) => {
          let value = asValue(modifier, theme.sepia)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('sepia', modifier)]: { '--tw-sepia': `sepia(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('sepia'), (value, modifier) => {
          return [
            nameClass('sepia', modifier),
            {
              '--tw-sepia': Array.isArray(value)
                ? value.map((v) => `sepia(${v})`).join(' ')
                : `sepia(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('sepia'))
    }
  }
}
