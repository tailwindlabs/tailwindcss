export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'backdrop-contrast': (value) => {
          return { '--tw-backdrop-contrast': `contrast(${value})` }
        },
      },
      {
        values: theme('backdropContrast'),
        variants: variants('backdropContrast'),
        type: 'any',
      }
    )
  }
}
