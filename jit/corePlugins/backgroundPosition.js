const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    bg: (modifier, { theme }) => {
      let value = theme.backgroundPosition[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('bg', modifier)]: { 'background-position': value } }
    },
  })
}
