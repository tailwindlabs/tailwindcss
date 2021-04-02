const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'min-h': (modifier, { theme }) => {
      let value = asValue(modifier, theme['minHeight'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('min-h', modifier)]: { 'min-height': value } }
    },
  })
}
