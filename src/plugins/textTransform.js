export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.uppercase': { 'text-transform': 'uppercase' },
        '.lowercase': { 'text-transform': 'lowercase' },
        '.capitalize': { 'text-transform': 'capitalize' },
        '.normal-case': { 'text-transform': 'none' },
      },
      variants
    )
  }
}
