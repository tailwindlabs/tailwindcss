export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-contrast': (value) => {
          return {
            '--tw-backdrop-contrast': `contrast(${value})`,
            '@defaults backdrop-filter': {},
            'backdrop-filter': 'var(--tw-backdrop-filter)',
          }
        },
      },
      {
        values: theme('backdropContrast'),
        variants: variants('backdropContrast'),
        type: 'any',
      }
    )
  }
}
