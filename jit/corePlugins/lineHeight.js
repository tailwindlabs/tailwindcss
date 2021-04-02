const { asLength, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    leading: (modifier, { theme }) => {
      let value = asLength(modifier, theme['lineHeight'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('leading', modifier)]: { 'line-height': value } }
    },
  })
}
