export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
