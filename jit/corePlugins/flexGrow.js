const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'flex-grow': (modifier, { theme }) => {
      let value = asValue(modifier, theme.flexGrow)

      if (value === undefined) {
        return []
      }

      return { [nameClass('flex-grow', modifier)]: { 'flex-grow': value } }
    },
  })
}
