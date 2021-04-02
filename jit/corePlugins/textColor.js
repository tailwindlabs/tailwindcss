const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const withAlphaVariable = require('../../lib/util/withAlphaVariable').default
const toColorValue = require('../../lib/util/toColorValue').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, jit: { theme } }) {
  let colorPalette = flattenColorPalette(theme.textColor)

  matchUtilities({
    text: (modifier, { theme }) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('text', modifier)]: withAlphaVariable({
          color: value,
          property: 'color',
          variable: '--tw-text-opacity',
        }),
      }
    },
  })
}
