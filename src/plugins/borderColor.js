import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addBase, matchUtilities, theme, variants, corePlugins }) {
    if (!corePlugins('borderOpacity')) {
      addBase({
        '*, ::before, ::after': {
          'border-color': theme('borderColor.DEFAULT', 'currentColor'),
        },
      })
    } else {
      addBase({
        '*, ::before, ::after': withAlphaVariable({
          color: theme('borderColor.DEFAULT', 'currentColor'),
          property: 'border-color',
          variable: '--tw-border-opacity',
        }),
      })
    }

    matchUtilities(
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
