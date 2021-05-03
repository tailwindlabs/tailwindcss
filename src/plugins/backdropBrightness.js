export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
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
