export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.flex-1': {
          flex: '1 1 0%',
        },
        '.flex-auto': {
          flex: '1 1 auto',
        },
        '.flex-initial': {
          flex: '0 1 auto',
        },
        '.flex-none': {
          flex: 'none',
        },
      },
      variants
    )
  }
}
