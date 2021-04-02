const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const withAlphaVariable = require('../../lib/util/withAlphaVariable').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ matchUtilities, theme }) {
  let colorPalette = flattenColorPalette(theme('placeholderColor'))

  matchUtilities({
    placeholder: (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return {
        [`${nameClass('placeholder', modifier)}::placeholder`]: withAlphaVariable({
          color: value,
          property: 'color',
          variable: '--tw-placeholder-opacity',
        }),
      }
    },
  })
}
