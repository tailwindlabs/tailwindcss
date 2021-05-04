export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
