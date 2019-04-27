export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.outline-none': { outline: '0' },
      },
      variants('outline')
    )
  }
}
