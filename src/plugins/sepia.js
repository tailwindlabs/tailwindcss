export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        sepia: (value) => {
          return { '--tw-sepia': `sepia(${value})` }
        },
      },
      { values: theme('sepia'), variants: variants('sepia'), type: 'any' }
    )
  }
}
