const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'col-start': (modifier, { theme }) => {
      let value = theme.gridColumnStart[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('col-start', modifier)]: { 'grid-column-start': value } }
    },
  })
}
