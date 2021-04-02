const { asAngle, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    'skew-x': (modifier, { theme }) => {
      let value = asAngle(modifier, theme.skew)

      if (value === undefined) {
        return []
      }

      return { [nameClass('skew-x', modifier)]: { '--tw-skew-x': value } }
    },
    'skew-y': (modifier, { theme }) => {
      let value = asAngle(modifier, theme.skew)

      if (value === undefined) {
        return []
      }

      return { [nameClass('skew-y', modifier)]: { '--tw-skew-y': value } }
    },
  })
}
