export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.table-auto': { 'table-layout': 'auto' },
      '.table-fixed': { 'table-layout': 'fixed' },
    },
    variants('tableLayout')
  )
}
