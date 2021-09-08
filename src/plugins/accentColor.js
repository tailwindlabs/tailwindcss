import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        accent: (value) => {
          return { 'accent-color': toColorValue(value) }
        },
      },
      {
        values: flattenColorPalette(theme('accentColor')),
        variants: variants('accentColor'),
        type: ['color', 'any'],
      }
    )
  }
}
