export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
