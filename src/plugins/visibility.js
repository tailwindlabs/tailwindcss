export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.visible': { visibility: 'visible' },
        '.invisible': { visibility: 'hidden' },
      },
      variants
    )
  }
}
