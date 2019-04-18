export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.uppercase': { 'text-transform': 'uppercase' },
        '.lowercase': { 'text-transform': 'lowercase' },
        '.capitalize': { 'text-transform': 'capitalize' },
        '.normal-case': { 'text-transform': 'none' },
      },
      variants('textTransform')
    )
  }
}
