export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.flex-grow': {
          'flex-grow': '1',
        },
        '.flex-shrink': {
          'flex-shrink': '1',
        },
        '.flex-grow-0': {
          'flex-grow': '0',
        },
        '.flex-shrink-0': {
          'flex-shrink': '0',
        },
      },
      variants
    )
  }
}
