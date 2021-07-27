export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
      {
        'divide-opacity': (value) => {
          return {
            [`& > :not([hidden]):not([type="hidden"]) ~ :not([hidden]):not([type="hidden"])`]: {
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
