export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-blur': (value) => {
          return {
            '--tw-backdrop-blur': `blur(${value})`,
            '@defaults backdrop-filter': {},
            'backdrop-filter': 'var(--tw-backdrop-filter)',
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
