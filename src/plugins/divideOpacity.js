export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'divide-opacity': (value) => {
          return {
            [`& > :not([hidden]) ~ :not([hidden])`]: {
              '--tw-divide-opacity': value,
            },
          }
        },
      },
      {
        values: theme('divideOpacity'),
        variants: variants('divideOpacity'),
        type: 'any',
      }
    )
  }
}
