export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.border-collapse': { 'border-collapse': 'collapse' },
        '.border-separate': { 'border-collapse': 'separate' },
      },
      variants('borderCollapse')
    )
  }
}
