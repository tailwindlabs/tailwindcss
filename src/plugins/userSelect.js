export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.select-none': { 'user-select': 'none' },
        '.select-text': { 'user-select': 'text' },
      },
      variants
    )
  }
}
