export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-grayscale': (value) => {
          return {
            '--tw-backdrop-grayscale': `grayscale(${value})`,
            ...(config('mode') === 'jit'
              ? {
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': 'var(--tw-backdrop-filter)',
                }
              : {}),
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
