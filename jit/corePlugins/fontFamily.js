const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('../../lib/util/transformThemeValue').default

module.exports = function ({ matchUtilities }) {
  let transformValue = transformThemeValue('fontFamily')

  matchUtilities({
    font: (modifier, { theme }) => {
      let value = transformValue(theme.fontFamily[modifier])

      if (modifier === '' || value === undefined) {
        return []
      }

      return { [nameClass('font', modifier)]: { 'font-family': transformValue(value) } }
    },
  })
}
