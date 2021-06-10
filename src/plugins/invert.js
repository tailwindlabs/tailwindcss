export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        invert: (value) => {
          return {
            '--tw-invert': `invert(${value})`,
            ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
          }
        },
      },
      {
        values: theme('invert'),
        variants: variants('invert'),
        type: 'any',
      }
    )
  }
}
