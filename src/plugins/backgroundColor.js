import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities2, theme, variants, corePlugins }) {
    matchUtilities2(
      {
        bg: (value) => {
          if (!corePlugins('backgroundOpacity')) {
            return {
              'background-color': value,
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'background-color',
            variable: '--tw-bg-opacity',
          })
        },
      },
      {
        values: flattenColorPalette(theme('backgroundColor')),
        variant: variants('backgroundColor'),
        type: 'color',
      }
    )
  }
}
