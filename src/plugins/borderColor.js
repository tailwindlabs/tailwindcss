import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addBase, matchUtilities, theme, variants, corePlugins }) {
    if (!corePlugins('borderOpacity')) {
      addBase({
        '@defaults border-width': {
          'border-color': theme('borderColor.DEFAULT', 'currentColor'),
        },
      })
    } else {
      addBase({
        '@defaults border-width': withAlphaVariable({
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

    matchUtilities(
      {
        'border-t': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-top-color': value,
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-top-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-r': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-right-color': value,
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-right-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-b': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-bottom-color': value,
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-bottom-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-l': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-left-color': value,
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-left-color',
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
