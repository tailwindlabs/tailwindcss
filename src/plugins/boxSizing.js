export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.box-border': { 'box-sizing': 'border' },
        '.box-content': { 'box-sizing': 'content' },
      },
      variants('boxSizing')
    )
  }
}
