export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
