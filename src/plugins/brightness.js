export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        brightness: (value) => {
          return { '--tw-brightness': `brightness(${value})` }
        },
      },
      {
        values: theme('brightness'),
        variants: variants('brightness'),
        type: 'any',
      }
    )
  }
}
