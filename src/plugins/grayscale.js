export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        grayscale: (value) => {
          return { '--tw-grayscale': `grayscale(${value})` }
        },
      },
      {
        values: theme('grayscale'),
        variants: variants('grayscale'),
        type: 'any',
      }
    )
  }
}
