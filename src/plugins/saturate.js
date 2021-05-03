export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        saturate: (value) => {
          return {
            '--tw-saturate': `saturate(${value})`,
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
