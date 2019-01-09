export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.table-auto': { 'table-layout': 'auto' },
      '.table-fixed': { 'table-layout': 'fixed' },
    }, config('modules.tableLayout'))
  }
}
