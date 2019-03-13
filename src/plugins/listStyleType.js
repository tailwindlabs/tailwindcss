export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.list-none': {
          'list-style-type': 'none',
        },
      },
      config('variants.listStyleType')
    )
  }
}
