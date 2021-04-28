import _ from 'lodash'
const { asValue, nameClass } = require('../../jit/pluginUtils')

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      matchUtilities({
        'placeholder-opacity': (modifier, { theme }) => {
          let value = asValue(modifier, theme.placeholderOpacity)

          if (value === undefined) {
            return []
          }

          return {
            [`${nameClass('placeholder-opacity', modifier)}::placeholder`]: {
              '--tw-placeholder-opacity': value,
            },
          }
        },
      })
    } else {
      const utilities = _.fromPairs(
        _.map(theme('placeholderOpacity'), (value, modifier) => {
          return [
            `${nameClass('placeholder-opacity', modifier)}::placeholder`,
            {
              '--tw-placeholder-opacity': value,
            },
          ]
        })
      )

      addUtilities(utilities, variants('placeholderOpacity'))
    }
  }
}
