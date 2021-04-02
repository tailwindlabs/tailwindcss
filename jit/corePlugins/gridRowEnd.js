const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'row-end': (modifier, { theme }) => {
      let value = theme.gridRowEnd[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('row-end', modifier)]: { 'grid-row-end': value } }
    },
  })
}
