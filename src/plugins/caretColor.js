import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        caret: (value) => {
          return { 'caret-color': toColorValue(value) }
        },
      },
      {
        values: flattenColorPalette(theme('caretColor')),
        variants: variants('caretColor'),
        type: ['color', 'any'],
      }
    )
  }
}
