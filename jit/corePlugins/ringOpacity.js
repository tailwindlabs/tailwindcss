const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'ring-opacity': (modifier, { theme }) => {
      let value = asValue(modifier, theme['ringOpacity'])

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('ring-opacity', modifier)]: {
          '--tw-ring-opacity': value,
        },
      }
    },
  })
}
