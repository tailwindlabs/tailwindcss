export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.appearance-none': { appearance: 'none' },
      },
      variants
    )
  }
}
