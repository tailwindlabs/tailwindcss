export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.select-none': { 'user-select': 'none' },
        '.select-text': { 'user-select': 'text' },
      },
      variants('userSelect')
    )
  }
}
