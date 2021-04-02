const { nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    object: (modifier, { theme }) => {
      if (modifier === '' || theme.objectPosition[modifier] === undefined) {
        return []
      }

      return {
        [nameClass('object', modifier)]: { 'object-position': theme.objectPosition[modifier] },
      }
    },
  })
}
