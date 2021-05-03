export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-invert': (value) => {
          return { '--tw-backdrop-invert': `invert(${value})` }
        },
      },
      {
        values: theme('backdropInvert'),
        variants: variants('backdropInvert'),
        type: 'any',
      }
    )
  }
}
