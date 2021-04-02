const { nameClass, asValue } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    duration: (modifier, { theme }) => {
      let value = asValue(modifier, theme.transitionDuration)

      if (value === undefined) {
        return []
      }

      return { [nameClass('duration', modifier)]: { 'transition-duration': value } }
    },
  })
}
