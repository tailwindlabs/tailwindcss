export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        sepia: (value) => {
          return {
            '--tw-sepia': `sepia(${value})`,
            ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
          }
        },
      },
      { values: theme('sepia'), variants: variants('sepia'), type: 'any' }
    )
  }
}
