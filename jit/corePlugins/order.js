const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    order: (modifier, { theme }) => {
      let value = asValue(modifier, theme.order)

      if (value === undefined) {
        return []
      }

      return { [nameClass('order', modifier)]: { order: value } }
    },
  })
}
