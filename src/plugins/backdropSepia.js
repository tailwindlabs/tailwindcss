export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-sepia': (value) => {
          return { '--tw-backdrop-sepia': `sepia(${value})` }
        },
      },
      {
        values: theme('backdropSepia'),
        variants: variants('backdropSepia'),
        type: 'any',
      }
    )
  }
}
