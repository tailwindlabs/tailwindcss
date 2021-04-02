const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default
const withAlphaVariable = require('tailwindcss/lib/util/withAlphaVariable').default
const toColorValue = require('tailwindcss/lib/util/toColorValue').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  let colorPalette = flattenColorPalette(theme.stroke)

  matchUtilities({
    stroke: (modifier, { theme }) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return { [nameClass('stroke', modifier)]: { stroke: toColorValue(value) } }
    },
  })
}
