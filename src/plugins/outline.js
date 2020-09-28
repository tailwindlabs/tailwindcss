export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.outline-none': { outline: '2px solid transparent', outlineOffset: '1px' },
      },
      variants('outline')
    )
  }
}
