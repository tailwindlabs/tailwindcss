const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    z: (modifier, { theme }) => {
      let value = asValue(modifier, theme.zIndex)

      if (value === undefined) {
        return []
      }

      return { [nameClass('z', modifier)]: { 'z-index': value } }
    },
  })
}
