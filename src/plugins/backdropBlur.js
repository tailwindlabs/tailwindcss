export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-blur': (value) => {
          return {
            '--tw-backdrop-blur': `blur(${value})`,
            ...(config('mode') === 'jit' ? { 'backdrop-filter': 'var(--tw-backdrop-filter)' } : {}),
          }
        },
      },
      {
        values: theme('backdropBlur'),
        variants: variants('backdropBlur'),
        type: 'any',
      }
    )
  }
}
