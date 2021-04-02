const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    flex: (modifier, { theme }) => {
      let value = theme.flex[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('flex', modifier)]: { flex: theme.flex[modifier] } }
    },
  })
}
