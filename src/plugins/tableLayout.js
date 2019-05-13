export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.table-auto': { 'table-layout': 'auto' },
        '.table-fixed': { 'table-layout': 'fixed' },
      },
      variants('tableLayout')
    )
  }
}
