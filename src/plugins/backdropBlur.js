export default function () {
  return function ({ matchUtilities2, theme }) {
    matchUtilities2(
      {
        'backdrop-blur': (value) => {
          return { '--tw-backdrop-blur': `blur(${value})` }
        },
      },
      {
        values: theme('backdropBlur'),
        variants: theme('backdropBlur'),
        type: 'any',
      }
    )
  }
}
