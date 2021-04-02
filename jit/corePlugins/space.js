const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default
const { asLength, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, addUtilities, jit: { theme } }) {
  matchUtilities({
    'space-x': (modifier, { theme }) => {
      let value = asLength(modifier, theme['space'])

      if (value === undefined) {
        return []
      }

      return {
        [`${nameClass('space-x', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
          '--tw-space-x-reverse': '0',
          'margin-right': `calc(${value} * var(--tw-space-x-reverse))`,
          'margin-left': `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
        },
      }
    },
    'space-y': (modifier, { theme }) => {
      let value = asLength(modifier, theme['space'])

      if (value === undefined) {
        return []
      }

      return {
        [`${nameClass('space-y', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
          '--tw-space-y-reverse': '0',
          'margin-top': `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
          'margin-bottom': `calc(${value} * var(--tw-space-y-reverse))`,
        },
      }
    },
  })

  addUtilities({
    '.space-y-reverse > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-y-reverse': '1',
    },
    '.space-x-reverse > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-x-reverse': '1',
    },
  })
}
