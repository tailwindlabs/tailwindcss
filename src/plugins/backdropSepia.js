export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-sepia': (value) => {
          return {
            '--tw-backdrop-sepia': `sepia(${value})`,
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
        values: theme('backdropSepia'),
        variants: variants('backdropSepia'),
        type: 'any',
      }
    )
  }
}
