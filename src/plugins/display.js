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
        '.flex': {
          display: 'flex',
        },
        '.inline-flex': {
          display: 'inline-flex',
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
