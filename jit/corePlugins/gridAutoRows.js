const { asList, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'auto-rows': (modifier, { theme }) => {
      let value = asList(modifier, theme.gridAutoRows)

      if (value === undefined) {
        return []
      }

      return { [nameClass('auto-rows', modifier)]: { 'grid-auto-rows': value } }
    },
  })
}
