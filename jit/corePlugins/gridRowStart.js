const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    'row-start': (modifier, { theme }) => {
      let value = theme.gridRowStart[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('row-start', modifier)]: { 'grid-row-start': value } }
    },
  })
}
