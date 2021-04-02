const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const toColorValue = require('../../lib/util/toColorValue').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, theme }) {
  let colorPalette = flattenColorPalette(theme('ringOffsetColor'))

  matchUtilities({
    'ring-offset': (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('ring-offset', modifier)]: {
          '--tw-ring-offset-color': toColorValue(value),
        },
      }
    },
  })
}
