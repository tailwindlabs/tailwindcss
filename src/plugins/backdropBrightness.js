export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-brightness': (value) => {
          return {
            '--tw-backdrop-brightness': `brightness(${value})`,
          }
        },
      },
      {
        values: theme('backdropBrightness'),
        variants: variants('backdropBrightness'),
        type: 'any',
      }
    )
  }
}
