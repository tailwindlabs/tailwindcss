export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-hue-rotate': (value) => {
          return { '--tw-backdrop-hue-rotate': `hue-rotate(${value})` }
        },
      },
      {
        values: theme('backdropHueRotate'),
        variants: variants('backdropHueRotate'),
        type: 'any',
      }
    )
  }
}
