export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'backdrop-saturate': (value) => {
          return { '--tw-backdrop-saturate': `saturate(${value})` }
        },
      },
      {
        values: theme('backdropSaturate'),
        variants: variants('backdropSaturate'),
        type: 'any',
      }
    )
  }
}
