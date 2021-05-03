import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities2, theme, variants, corePlugins }) {
    matchUtilities2(
      {
        border: (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-color': value,
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-color',
            variable: '--tw-border-opacity',
          })
        },
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette(theme('borderColor'))),
        variants: variants('borderColor'),
        type: 'color',
      }
    )
  }
}
