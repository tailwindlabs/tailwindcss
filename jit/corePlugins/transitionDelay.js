const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    delay: (modifier, { theme }) => {
      let value = theme.transitionDelay[modifier]

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('delay', modifier)]: { 'transition-delay': value },
      }
    },
  })
}
