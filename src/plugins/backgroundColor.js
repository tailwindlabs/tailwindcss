import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities, theme, variants, corePlugins }) {
    matchUtilities(
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
        variants: variants('backgroundColor'),
        type: 'color',
      }
    )
  }
}
