export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
