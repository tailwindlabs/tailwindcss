export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        blur: (value) => {
          return {
            '--tw-blur': `blur(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
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
