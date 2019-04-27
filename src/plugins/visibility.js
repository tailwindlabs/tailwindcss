export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.visible': { visibility: 'visible' },
        '.invisible': { visibility: 'hidden' },
      },
      variants('visibility')
    )
  }
}
