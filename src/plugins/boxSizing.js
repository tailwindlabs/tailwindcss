export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.box-border': { 'box-sizing': 'border-box' },
        '.box-content': { 'box-sizing': 'content-box' },
      },
      variants('boxSizing')
    )
  }
}
