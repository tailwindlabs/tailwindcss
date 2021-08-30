export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        invert: (value) => {
          return {
            '--tw-invert': `invert(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
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
