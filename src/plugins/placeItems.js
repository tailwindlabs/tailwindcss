export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.place-items-auto': {
          'place-items': 'auto',
        },
        '.place-items-start': {
          'place-items': 'start',
        },
        '.place-items-end': {
          'place-items': 'end',
        },
        '.place-items-center': {
          'place-items': 'center',
        },
        '.place-items-stretch': {
          'place-items': 'stretch',
        },
      },
      variants('placeItems')
    )
  }
}
