export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
