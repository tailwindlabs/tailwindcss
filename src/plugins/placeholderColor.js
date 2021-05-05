import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities, theme, variants, corePlugins }) {
    matchUtilities(
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
