export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.list-inside': { 'list-style-position': 'inside' },
        '.list-outside': { 'list-style-position': 'outside' },
      },
      variants('listStylePosition')
    )
  }
}
