const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'max-w': (modifier, { theme }) => {
      let value = asValue(modifier, theme['maxWidth'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('max-w', modifier)]: { 'max-width': value } }
    },
  })
}
