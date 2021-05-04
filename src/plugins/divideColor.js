import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities2, theme, variants, corePlugins }) {
    matchUtilities2(
      {
        divide: (value) => {
          if (!corePlugins('divideOpacity')) {
            return {
              ['& > :not([hidden]) ~ :not([hidden])']: {
                'border-color': value,
              },
            }
          }

          return {
            ['& > :not([hidden]) ~ :not([hidden])']: withAlphaVariable({
              color: value,
              property: 'border-color',
              variable: '--tw-divide-opacity',
            }),
          }
        },
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette(theme('divideColor'))),
        variants: variants('divideColor'),
        type: 'color',
      }
    )
  }
}
