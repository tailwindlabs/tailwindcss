export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'hue-rotate': (value) => {
          return {
            '--tw-hue-rotate': `hue-rotate(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
          }
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
