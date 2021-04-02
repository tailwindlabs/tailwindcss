const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  let transformValue = transformThemeValue('fontFamily')

  matchUtilities({
    font: (modifier, { theme }) => {
      let transformValue = transformThemeValue('fontFamily')
      let value = transformValue(theme.fontFamily[modifier])

      if (modifier === '' || value === undefined) {
        return []
      }

      return { [nameClass('font', modifier)]: { 'font-family': transformValue(value) } }
    },
  })
}
