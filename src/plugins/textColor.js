import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities2, theme, variants, corePlugins }) {
    matchUtilities2(
      {
        text: (value) => {
          if (!corePlugins('textOpacity')) {
            return { color: value }
          }

          return withAlphaVariable({
            color: value,
            property: 'color',
            variable: '--tw-text-opacity',
          })
        },
      },
      {
        values: flattenColorPalette(theme('textColor')),
        variants: variants('textColor'),
        type: 'color',
      }
    )
  }
}
