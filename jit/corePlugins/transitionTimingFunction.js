const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    ease: (modifier, { theme }) => {
      let value = theme.transitionTimingFunction[modifier]

      if (value === undefined) {
        return []
      }

      return { [nameClass('ease', modifier)]: { 'transition-timing-function': value } }
    },
  })
}
