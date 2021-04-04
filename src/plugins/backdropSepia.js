import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'backdrop-sepia': (modifier, { theme }) => {
          let value = asValue(modifier, theme.backdropSepia)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('backdrop-sepia', modifier)]: {
              '--tw-backdrop-sepia': `sepia(${value})`,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('backdropSepia'), (value, modifier) => {
          return [
            nameClass('backdrop-sepia', modifier),
            {
              '--tw-backdrop-sepia': Array.isArray(value)
                ? value.map((v) => `sepia(${v})`).join(' ')
                : `sepia(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('backdropSepia'))
    }
  }
}
