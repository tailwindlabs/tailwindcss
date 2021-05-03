export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        invert: (value) => {
          return { '--tw-invert': `invert(${value})` }
        },
      },
      {
        values: theme('invert'),
        variants: variants('invert'),
        type: 'any',
      }
    )
  }
}
