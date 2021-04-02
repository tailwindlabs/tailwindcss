const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    col: (modifier, { theme }) => {
      if (modifier === '' || theme.gridColumn[modifier] === undefined) {
        return []
      }

      return { [nameClass('col', modifier)]: { 'grid-column': theme.gridColumn[modifier] } }
    },
  })
}
