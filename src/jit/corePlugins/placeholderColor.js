const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const withAlphaVariable = require('../../lib/util/withAlphaVariable').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ corePlugins, matchUtilities, theme }) {
  let colorPalette = flattenColorPalette(theme('placeholderColor'))

  matchUtilities({
    placeholder: (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      if (corePlugins('placeholderOpacity')) {
        return {
          [`${nameClass('placeholder', modifier)}::placeholder`]: withAlphaVariable({
            color: value,
            property: 'color',
            variable: '--tw-placeholder-opacity',
          }),
        }
      }

      return {
        [`${nameClass('placeholder', modifier)}::placeholder`]: { color: value },
      }
    },
  })
}
