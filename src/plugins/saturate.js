export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        saturate: (value) => {
          return {
            '--tw-saturate': `saturate(${value})`,
            ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
          }
        },
      },
      {
        values: theme('saturate'),
        variants: variants('saturate'),
        type: 'any',
      }
    )
  }
}
