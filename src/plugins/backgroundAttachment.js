export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.bg-fixed': { 'background-attachment': 'fixed' },
        '.bg-local': { 'background-attachment': 'local' },
        '.bg-scroll': { 'background-attachment': 'scroll' },
      },
      variants
    )
  }
}
