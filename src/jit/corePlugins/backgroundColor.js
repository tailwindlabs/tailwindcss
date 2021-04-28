const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const withAlphaVariable = require('../../lib/util/withAlphaVariable').default
const { asColor, nameClass } = require('../pluginUtils')

module.exports = function ({ corePlugins, matchUtilities, theme }) {
  let colorPalette = flattenColorPalette(theme('backgroundColor'))

  matchUtilities({
    bg: (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      if (corePlugins('backgroundOpacity')) {
        return {
          [nameClass('bg', modifier)]: withAlphaVariable({
            color: value,
            property: 'background-color',
            variable: '--tw-bg-opacity',
          }),
        }
      }

      return { [nameClass('bg', modifier)]: { 'background-color': value } }
    },
  })
}
