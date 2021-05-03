export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        sepia: (value) => {
          return { '--tw-sepia': `sepia(${value})` }
        },
      },
      { values: theme('sepia'), variants: variants('sepia'), type: 'any' }
    )
  }
}
