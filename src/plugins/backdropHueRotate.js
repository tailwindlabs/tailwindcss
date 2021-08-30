export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-hue-rotate': (value) => {
          return {
            '--tw-backdrop-hue-rotate': `hue-rotate(${value})`,
            '@defaults backdrop-filter': {},
            'backdrop-filter': 'var(--tw-backdrop-filter)',
          }
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
