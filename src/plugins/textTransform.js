export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.uppercase': { 'text-transform': 'uppercase' },
        '.lowercase': { 'text-transform': 'lowercase' },
        '.capitalize': { 'text-transform': 'capitalize' },
        '.normal-case': { 'text-transform': 'none' },
      },
      config('variants.textTransform')
    )
  }
}
