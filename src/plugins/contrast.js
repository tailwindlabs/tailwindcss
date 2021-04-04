import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        contrast: (modifier, { theme }) => {
          let value = asValue(modifier, theme.contrast)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('contrast', modifier)]: { '--tw-contrast': `contrast(${value})` },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('contrast'), (value, modifier) => {
          return [
            nameClass('contrast', modifier),
            {
              '--tw-contrast': Array.isArray(value)
                ? value.map((v) => `contrast(${v})`).join(' ')
                : `contrast(${value})`,
            },
          ]
        })
      )

      addUtilities(utilities, variants('contrast'))
    }
  }
}
