import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        fill: (value) => {
          return { fill: toColorValue(value) }
        },
      },
      {
        values: flattenColorPalette(theme('fill')),
        variants: variants('fill'),
        type: ['color', 'any'],
      }
    )
  }
}
