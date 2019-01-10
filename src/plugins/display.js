export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.block': {
        display: 'block',
      },
      '.inline-block': {
        display: 'inline-block',
      },
      '.inline': {
        display: 'inline',
      },
      '.table': {
        display: 'table',
      },
      '.table-row': {
        display: 'table-row',
      },
      '.table-cell': {
        display: 'table-cell',
      },
      '.hidden': {
        display: 'none',
      },
    }, config('modules.display'))
  }
}
