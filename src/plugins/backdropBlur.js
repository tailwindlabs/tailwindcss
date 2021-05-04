export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-blur': (value) => {
          return { '--tw-backdrop-blur': `blur(${value})` }
        },
      },
      {
        values: theme('backdropBlur'),
        variants: variants('backdropBlur'),
        type: 'any',
      }
    )
  }
}
