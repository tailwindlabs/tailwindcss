const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'border-opacity': (modifier, { theme }) => {
      let value = asValue(modifier, theme.borderOpacity)

      if (value === undefined) {
        return []
      }

      return { [nameClass('border-opacity', modifier)]: { '--tw-border-opacity': value } }
    },
  })
}
