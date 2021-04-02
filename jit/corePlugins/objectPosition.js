const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    object: (modifier, { theme }) => {
      if (modifier === '' || theme.objectPosition[modifier] === undefined) {
        return []
      }

      return {
        [nameClass('object', modifier)]: { 'object-position': theme.objectPosition[modifier] },
      }
    },
  })
}
