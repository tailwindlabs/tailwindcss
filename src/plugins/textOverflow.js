export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.overflow-ellipsis': { 'text-overflow': 'ellipsis' },
        '.overflow-clip': { 'text-overflow': 'clip' },
      },
      variants('textOverflow')
    )
  }
}
