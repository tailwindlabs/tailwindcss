export default function() {
  return function({ addUtilities, config }) {
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
      config('variants.flexDirection')
    )
  }
}
