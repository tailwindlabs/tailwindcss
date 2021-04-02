const { asLength, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'translate-x': (modifier, { theme }) => {
      let value = asLength(modifier, theme['translate'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('translate-x', modifier)]: { '--tw-translate-x': value } }
    },
    'translate-y': (modifier, { theme }) => {
      let value = asLength(modifier, theme['translate'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('translate-y', modifier)]: { '--tw-translate-y': value } }
    },
  })
}
