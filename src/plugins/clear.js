export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.clear-left': { clear: 'left' },
        '.clear-right': { clear: 'right' },
        '.clear-both': { clear: 'both' },
        '.clear-none': { clear: 'none' },
      },
      variants('clear')
    )
  }
}
