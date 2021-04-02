const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const toColorValue = require('../../lib/util/toColorValue').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, theme }) {
  let colorPalette = flattenColorPalette(theme('fill'))

  matchUtilities({
    fill: (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return { [nameClass('fill', modifier)]: { fill: toColorValue(value) } }
    },
  })
}
