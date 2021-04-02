const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'max-h': (modifier, { theme }) => {
      let value = asValue(modifier, theme['maxHeight'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('max-h', modifier)]: { 'max-height': value } }
    },
  })
}
