const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default
const withAlphaVariable = require('tailwindcss/lib/util/withAlphaVariable').default
const toColorValue = require('tailwindcss/lib/util/toColorValue').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  let colorPalette = flattenColorPalette(theme.divideColor)

  // TODO: Make sure there is no issue with DEFAULT here
  matchUtilities({
    divide: (modifier, { theme }) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return {
        [`${nameClass('divide', modifier)} > :not([hidden]) ~ :not([hidden])`]: withAlphaVariable({
          color: colorPalette[modifier],
          property: 'border-color',
          variable: '--tw-divide-opacity',
        }),
      }
    },
  })
}
