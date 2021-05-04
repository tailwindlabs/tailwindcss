import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
