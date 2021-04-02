const { asValue, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities }) {
  matchUtilities({
    'placeholder-opacity': (modifier, { theme }) => {
      let value = asValue(modifier, theme.placeholderOpacity)

      if (value === undefined) {
        return []
      }

      return {
        [`${nameClass('placeholder-opacity', modifier)}::placeholder`]: {
          '--tw-placeholder-opacity': value,
        },
      }
    },
  })
}
