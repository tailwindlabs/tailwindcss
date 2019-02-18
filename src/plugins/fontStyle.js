export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.italic': { 'font-style': 'italic' },
        '.roman': { 'font-style': 'normal' },
      },
      variants
    )
  }
}
