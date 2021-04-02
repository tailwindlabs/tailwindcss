const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    list: (modifier, { theme }) => {
      if (modifier === '' || theme.listStyleType[modifier] === undefined) {
        return []
      }

      return { [nameClass('list', modifier)]: { 'list-style-type': theme.listStyleType[modifier] } }
    },
  })
}
