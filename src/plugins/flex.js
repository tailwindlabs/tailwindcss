export default function() {
  return function({ addUtilities, config }) {
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
      config('variants.flex')
    )
  }
}
