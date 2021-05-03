export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-opacity': (value) => {
          return { '--tw-backdrop-opacity': `opacity(${value})` }
        },
      },
      {
        values: theme('backdropOpacity'),
        variants: variants('backdropOpacity'),
        type: 'any',
      }
    )
  }
}
