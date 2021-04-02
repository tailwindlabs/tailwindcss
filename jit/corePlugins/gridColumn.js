const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    col: (modifier, { theme }) => {
      if (modifier === '' || theme.gridColumn[modifier] === undefined) {
        return []
      }

      return { [nameClass('col', modifier)]: { 'grid-column': theme.gridColumn[modifier] } }
    },
  })
}
