const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    w: (modifier, { theme }) => {
      let value = asValue(modifier, theme['width'])

      if (value === undefined) {
        return []
      }

      return { [nameClass('w', modifier)]: { width: value } }
    },
  })
}
