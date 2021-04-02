const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    'col-end': (modifier, { theme }) => {
      let transformValue = transformThemeValue('gridColumnEnd')
      let value = transformValue(theme.gridColumnEnd[modifier])

      if (value === undefined) {
        return []
      }

      return { [nameClass('col-end', modifier)]: { 'grid-column-end': value } }
    },
  })
}
