export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.italic': { 'font-style': 'italic' },
        '.not-italic': { 'font-style': 'normal' },
      },
      variants
    )
  }
}
