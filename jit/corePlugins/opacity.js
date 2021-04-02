const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    opacity: (modifier, { theme }) => {
      let value = asValue(modifier, theme.opacity)

      if (value === undefined) {
        return []
      }

      return { [nameClass('opacity', modifier)]: { opacity: value } }
    },
  })
}
