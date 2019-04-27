export default function() {
  return function({ addUtilities, variants }) {
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
      variants('flexDirection')
    )
  }
}
