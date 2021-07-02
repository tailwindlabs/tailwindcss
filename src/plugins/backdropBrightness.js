export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-brightness': (value) => {
          return {
            '--tw-backdrop-brightness': `brightness(${value})`,
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
        values: theme('backdropBrightness'),
        variants: variants('backdropBrightness'),
        type: 'any',
      }
    )
  }
}
