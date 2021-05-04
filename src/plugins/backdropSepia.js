export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
