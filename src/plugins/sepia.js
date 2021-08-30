export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        sepia: (value) => {
          return {
            '--tw-sepia': `sepia(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
          }
        },
      },
      { values: theme('sepia'), variants: variants('sepia'), type: 'any' }
    )
  }
}
