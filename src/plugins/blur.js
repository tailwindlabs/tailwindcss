export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        blur: (value) => {
          return { '--tw-blur': `blur(${value})` }
        },
      },
      {
        values: theme('blur'),
        variants: variants('blur'),
        type: 'any',
      }
    )
  }
}
