const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    outline: (modifier, { theme }) => {
      let value = theme.outline[modifier]

      if (value === undefined) {
        return []
      }

      let [outline, outlineOffset = '0'] = Array.isArray(value) ? value : [value]

      return {
        [nameClass('outline', modifier)]: {
          outline,
          'outline-offset': outlineOffset,
        },
      }
    },
  })
}
