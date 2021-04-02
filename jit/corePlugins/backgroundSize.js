const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    bg: (modifier, { theme }) => {
      let value = theme.backgroundSize[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('bg', modifier)]: { 'background-size': value } }
    },
  })
}
