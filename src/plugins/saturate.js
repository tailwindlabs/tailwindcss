export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        saturate: (value) => {
          return {
            '--tw-saturate': `saturate(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
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
