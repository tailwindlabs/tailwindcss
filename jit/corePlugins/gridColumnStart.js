const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    'col-start': (modifier, { theme }) => {
      let transformValue = transformThemeValue('gridColumnStart')
      let value = transformValue(theme.gridColumnStart[modifier])

      if (value === undefined) {
        return []
      }

      return { [nameClass('col-start', modifier)]: { 'grid-column-start': value } }
    },
  })
}
