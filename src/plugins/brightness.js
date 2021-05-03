export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
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
