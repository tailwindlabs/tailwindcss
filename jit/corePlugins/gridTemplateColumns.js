const { asList, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'grid-cols': (modifier, { theme }) => {
      let value = asList(modifier, theme.gridTemplateColumns)

      if (value === undefined) {
        return []
      }

      return { [nameClass('grid-cols', modifier)]: { 'grid-template-columns': value } }
    },
  })
}
