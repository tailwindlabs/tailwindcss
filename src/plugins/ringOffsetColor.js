import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
