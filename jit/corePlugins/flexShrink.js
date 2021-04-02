const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'flex-shrink': (modifier, { theme }) => {
      let value = asValue(modifier, theme.flexShrink)

      if (value === undefined) {
        return []
      }

      return { [nameClass('flex-shrink', modifier)]: { 'flex-shrink': value } }
    },
  })
}
