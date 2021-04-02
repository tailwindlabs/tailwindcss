const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
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
