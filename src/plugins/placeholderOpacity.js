export default function () {
  return function ({ matchUtilities, theme, variants }) {
    matchUtilities(
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
