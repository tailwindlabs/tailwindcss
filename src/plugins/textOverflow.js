export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.ellipsis': { 'text-overflow': 'ellipsis' },
        '.no-ellipsis': { 'text-overflow': 'clip' },
      },
      variants('textOverflow')
    )
  }
}
