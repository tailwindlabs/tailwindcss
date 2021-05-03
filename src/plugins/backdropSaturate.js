export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-saturate': (value) => {
          return { '--tw-backdrop-saturate': `saturate(${value})` }
        },
      },
      {
        values: theme('backdropSaturate'),
        variants: variants('backdropSaturate'),
        type: 'any',
      }
    )
  }
}
