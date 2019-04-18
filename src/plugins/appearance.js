export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.appearance-none': { appearance: 'none' },
      },
      variants('appearance')
    )
  }
}
