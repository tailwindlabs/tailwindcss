import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'ring-offset': (value) => {
          return {
            '--tw-ring-offset-color': toColorValue(value),
          }
        },
      },
      {
        values: flattenColorPalette(theme('ringOffsetColor')),
        variants: variants('ringOffsetColor'),
        type: 'color',
      }
    )
  }
}
