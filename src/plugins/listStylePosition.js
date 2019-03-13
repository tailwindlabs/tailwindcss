export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.list-inside': { 'list-style-position': 'inside' },
        '.list-outside': { 'list-style-position': 'outside' },
      },
      config('variants.listStylePosition')
    )
  }
}
