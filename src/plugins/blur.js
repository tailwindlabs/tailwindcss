export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
