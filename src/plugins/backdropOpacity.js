export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-opacity': (value) => {
          return {
            '--tw-backdrop-opacity': `opacity(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
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
