export default function() {
  return function({ addUtilities, config }) {
    const tableLayout = config('classesNames').tableLayout

    addUtilities(
      {
        [`.${tableLayout}-auto`]: { 'table-layout': 'auto' },
        [`.${tableLayout}-fixed`]: { 'table-layout': 'fixed' },
      },
      config('variants.tableLayout')
    )
  }
}
