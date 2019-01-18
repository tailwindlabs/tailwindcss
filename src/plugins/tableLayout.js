export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.table-auto': { 'table-layout': 'auto' },
        '.table-fixed': { 'table-layout': 'fixed' },
      },
      variants
    )
  }
}
