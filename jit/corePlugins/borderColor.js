const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const withAlphaVariable = require('../../lib/util/withAlphaVariable').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, theme }) {
  let colorPalette = flattenColorPalette(theme('borderColor'))

  matchUtilities({
    border: (modifier) => {
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
