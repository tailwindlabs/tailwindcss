const { asLength, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  matchUtilities({
    'ring-offset': (modifier, { theme }) => {
      let value = asLength(modifier, theme['ringOffsetWidth'])

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('ring-offset', modifier)]: {
          '--tw-ring-offset-width': value,
        },
      }
    },
  })
}
