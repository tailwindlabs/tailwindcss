export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        contrast: (value) => {
          return {
            '--tw-contrast': `contrast(${value})`,
            '@defaults filter': {},
            filter: 'var(--tw-filter)',
          }
        },
      },
      { values: theme('contrast'), variants: variants('contrast'), type: 'any' }
    )
  }
}
