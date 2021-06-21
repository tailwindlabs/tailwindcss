export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-invert': (value) => {
          return {
            '--tw-backdrop-invert': `invert(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
          }
        },
      },
      {
        values: theme('backdropInvert'),
        variants: variants('backdropInvert'),
        type: 'any',
      }
    )
  }
}
