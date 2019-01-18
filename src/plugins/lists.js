export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.list-reset': {
          'list-style': 'none',
          padding: '0',
        },
      },
      variants
    )
  }
}
