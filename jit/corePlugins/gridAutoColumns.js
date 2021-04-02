const { asList, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'auto-cols': (modifier, { theme }) => {
      let value = asList(modifier, theme.gridAutoColumns)

      if (value === undefined) {
        return []
      }

      return { [nameClass('auto-cols', modifier)]: { 'grid-auto-columns': value } }
    },
  })
}
