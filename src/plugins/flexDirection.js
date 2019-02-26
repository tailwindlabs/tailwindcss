export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.flex-row': {
          'flex-direction': 'row',
        },
        '.flex-row-reverse': {
          'flex-direction': 'row-reverse',
        },
        '.flex-col': {
          'flex-direction': 'column',
        },
        '.flex-col-reverse': {
          'flex-direction': 'column-reverse',
        },
      },
      variants
    )
  }
}
