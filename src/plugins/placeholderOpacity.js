export default function () {
  return function ({ matchUtilities2, theme, variants }) {
    matchUtilities2(
      {
        'placeholder-opacity': (value) => {
          return { ['&::placeholder']: { '--tw-placeholder-opacity': value } }
        },
      },
      {
        values: theme('placeholderOpacity'),
        variants: variants('placeholderOpacity'),
        type: 'any',
      }
    )
  }
}
