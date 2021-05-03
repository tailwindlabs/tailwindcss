import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities2, theme, variants, corePlugins }) {
    matchUtilities2(
      {
        placeholder: (value) => {
          if (!corePlugins('placeholderOpacity')) {
            return {
              '&::placeholder': {
                color: value,
              },
            }
          }

          return {
            '&::placeholder': withAlphaVariable({
              color: value,
              property: 'color',
              variable: '--tw-placeholder-opacity',
            }),
          }
        },
      },
      {
        values: flattenColorPalette(theme('placeholderColor')),
        variants: variants('placeholderColor'),
        type: 'any',
      }
    )
  }
}
