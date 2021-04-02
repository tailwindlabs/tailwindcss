const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    font: (modifier, { theme }) => {
      let value = theme.fontWeight[modifier]
      if (value === undefined) {
        return []
      }

      return { [nameClass('font', modifier)]: { 'font-weight': value } }
    },
  })
}
