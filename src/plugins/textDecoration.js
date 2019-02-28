export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.underline': { 'text-decoration': 'underline' },
        '.line-through': { 'text-decoration': 'line-through' },
        '.no-underline': { 'text-decoration': 'none' },
      },
      config('variants.textDecoration')
    )
  }
}
