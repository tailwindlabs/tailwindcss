export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        contrast: (value) => {
          return { '--tw-contrast': `contrast(${value})` }
        },
      },
      { values: theme('contrast'), variants: variants('contrast'), type: 'any' }
    )
  }
}
