const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    flex: (modifier, { theme }) => {
      let value = theme.flex[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('flex', modifier)]: { flex: theme.flex[modifier] } }
    },
  })
}
