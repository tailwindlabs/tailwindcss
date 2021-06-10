export default function () {
  return function ({ config, matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'hue-rotate': (value) => {
          return {
            '--tw-hue-rotate': `hue-rotate(${value})`,
            ...(config('mode') === 'jit' ? { filter: 'var(--tw-filter)' } : {}),
          }
        },
      },
      {
        values: theme('hueRotate'),
        variants: variants('hueRotate'),
        type: 'any',
      }
    )
  }
}
