export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.underline': { 'text-decoration': 'underline' },
        '.line-through': { 'text-decoration': 'line-through' },
        '.no-underline': { 'text-decoration': 'none' },
      },
      variants
    )
  }
}
