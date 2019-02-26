export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.flex-grow-0': {
          'flex-grow': '0',
        },
        '.flex-grow': {
          'flex-grow': '1',
        },
      },
      variants
    )
  }
}
