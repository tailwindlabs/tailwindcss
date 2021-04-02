const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

let transformValue = transformThemeValue('boxShadow')
let shadowReset = {
  '*': {
    '--tw-shadow': '0 0 #0000',
  },
}

module.exports = function ({ addBase, matchUtilities, jit: { theme } }) {
  addBase(shadowReset)
  matchUtilities({
    shadow: (modifier, { theme }) => {
      modifier = modifier === '' ? 'DEFAULT' : modifier

      let value = transformValue(theme.boxShadow[modifier])

      if (value === undefined) {
        return []
      }

      return [
        {
          [nameClass('shadow', modifier)]: {
            '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
            'box-shadow': [
              `var(--tw-ring-offset-shadow, 0 0 #0000)`,
              `var(--tw-ring-shadow, 0 0 #0000)`,
              `var(--tw-shadow)`,
            ].join(', '),
          },
        },
      ]
    },
  })
}
