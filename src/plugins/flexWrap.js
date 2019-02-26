export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.flex-wrap': {
          'flex-wrap': 'wrap',
        },
        '.flex-wrap-reverse': {
          'flex-wrap': 'wrap-reverse',
        },
        '.flex-no-wrap': {
          'flex-wrap': 'nowrap',
        },
      },
      variants
    )
  }
}
