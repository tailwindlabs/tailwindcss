export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-saturate': (value) => {
          return {
            '--tw-backdrop-saturate': `saturate(${value})`,
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
        values: theme('backdropSaturate'),
        variants: variants('backdropSaturate'),
        type: 'any',
      }
    )
  }
}
