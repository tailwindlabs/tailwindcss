const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default
const withAlphaVariable = require('tailwindcss/lib/util/withAlphaVariable').default
const toColorValue = require('tailwindcss/lib/util/toColorValue').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  let colorPalette = flattenColorPalette(theme.borderColor)

  matchUtilities({
    border: (modifier, { theme }) => {
      if (modifier === 'DEFAULT') {
        return []
      }

      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('border', modifier)]: withAlphaVariable({
          color: value,
          property: 'border-color',
          variable: '--tw-border-opacity',
        }),
      }
    },
  })
}
