const { asAngle, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    rotate: (modifier, { theme }) => {
      let value = asAngle(modifier, theme.rotate)

      if (value === undefined) {
        return []
      }

      return { [nameClass('rotate', modifier)]: { '--tw-rotate': value } }
    },
  })
}
