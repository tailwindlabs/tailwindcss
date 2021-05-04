import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        stroke: (value) => {
          return {
            stroke: toColorValue(value),
          }
        },
      },
      {
        values: flattenColorPalette(theme('stroke')),
        variants: variants('stroke'),
        type: 'color',
      }
    )
  }
}
