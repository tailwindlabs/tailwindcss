export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.box-sizing-border': { 'box-sizing': 'border' },
        '.box-sizing-content': { 'box-sizing': 'content' },
      },
      variants('boxSizing')
    )
  }
}
