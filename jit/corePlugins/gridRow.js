const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    row: (modifier, { theme }) => {
      let value = theme.gridRow[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('row', modifier)]: { 'grid-row': value } }
    },
  })
}
