export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.outline-none': { outline: '0' },
      },
      variants
    )
  }
}
