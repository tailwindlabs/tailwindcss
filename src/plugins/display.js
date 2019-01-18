export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
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
      },
      variants
    )
  }
}
