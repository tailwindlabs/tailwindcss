export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'hue-rotate': (value) => {
          return { '--tw-hue-rotate': `hue-rotate(${value})` }
        },
      },
      {
        values: theme('hueRotate'),
        variants: variants('hueRotate'),
        type: 'any',
      }
    )
  }
}
