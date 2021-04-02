const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'text-opacity': (modifier, { theme }) => {
      let value = asValue(modifier, theme.textOpacity)

      if (value === undefined) {
        return []
      }

      return { [nameClass('text-opacity', modifier)]: { '--tw-text-opacity': value } }
    },
  })
}
