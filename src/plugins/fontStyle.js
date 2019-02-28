export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.italic': { 'font-style': 'italic' },
        '.not-italic': { 'font-style': 'normal' },
      },
      config('variants.fontStyle')
    )
  }
}
