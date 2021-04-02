const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    origin: (modifier, { theme }) => {
      let value = theme.transformOrigin[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('origin', modifier)]: { 'transform-origin': value } }
    },
  })
}
