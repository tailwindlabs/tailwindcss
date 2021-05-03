export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-grayscale': (value) => {
          return {
            '--tw-backdrop-grayscale': `grayscale(${value})`,
          }
        },
      },
      {
        values: theme('backdropGrayscale'),
        variants: variants('backdropGrayscale'),
        type: 'any',
      }
    )
  }
}
