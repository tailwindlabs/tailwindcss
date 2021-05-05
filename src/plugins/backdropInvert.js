export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
