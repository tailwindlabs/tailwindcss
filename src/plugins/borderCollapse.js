export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.border-collapse': { 'border-collapse': 'collapse' },
        '.border-separate': { 'border-collapse': 'separate' },
      },
      variants
    )
  }
}
