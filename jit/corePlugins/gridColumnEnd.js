const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'col-end': (modifier, { theme }) => {
      let value = theme.gridColumnEnd[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('col-end', modifier)]: { 'grid-column-end': value } }
    },
  })
}
