export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        blur: (value) => {
          return {
            '--tw-blur': `blur(${value})`,
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
        values: theme('blur'),
        variants: variants('blur'),
        type: 'any',
      }
    )
  }
}
