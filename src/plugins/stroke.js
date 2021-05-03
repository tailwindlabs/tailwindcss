import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities2, theme }) {
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
        variants: theme('stroke'),
        type: 'color',
      }
    )
  }
}
