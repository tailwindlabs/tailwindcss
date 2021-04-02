const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    font: (modifier, { theme }) => {
      let value = theme.fontWeight[modifier]
      if (value === undefined) {
        return []
      }

      return { [nameClass('font', modifier)]: { 'font-weight': value } }
    },
  })
}
