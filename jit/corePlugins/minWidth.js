const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'min-w': (modifier, { theme }) => {
      let value = asValue(modifier, theme['minWidth'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('min-w', modifier)]: { 'min-width': value } }
    },
  })
}
