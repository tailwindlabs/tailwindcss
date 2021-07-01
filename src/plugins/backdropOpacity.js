export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-opacity': (value) => {
          return {
            '--tw-backdrop-opacity': `opacity(${value})`,
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
        values: theme('backdropOpacity'),
        variants: variants('backdropOpacity'),
        type: 'any',
      }
    )
  }
}
