export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        brightness: (value) => {
          return {
            '--tw-brightness': `brightness(${value})`,
            ...(config('mode') === 'jit'
              ? {
                  '@defaults filter': {},
                  filter: 'var(--tw-filter)',
                }
              : {}),
          }
        },
      },
      {
        values: theme('brightness'),
        variants: variants('brightness'),
        type: 'any',
      }
    )
  }
}
