export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.select-none': { 'user-select': 'none' },
        '.select-text': { 'user-select': 'text' },
        '.select-all': { 'user-select': 'all' },
        '.select-contain': { 'user-select': 'contain' },
        '.select-auto': { 'user-select': 'auto' },
      },
      variants('userSelect')
    )
  }
}
