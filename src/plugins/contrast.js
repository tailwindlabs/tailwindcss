export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        contrast: (value) => {
          return { '--tw-contrast': `contrast(${value})` }
        },
      },
      { values: theme('contrast'), variants: variants('contrast'), type: 'any' }
    )
  }
}
