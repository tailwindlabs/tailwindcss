export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.whitespace-normal': { 'white-space': 'normal' },
        '.whitespace-no-wrap': { 'white-space': 'nowrap' },
        '.whitespace-pre': { 'white-space': 'pre' },
        '.whitespace-pre-line': { 'white-space': 'pre-line' },
        '.whitespace-pre-wrap': { 'white-space': 'pre-wrap' },

        '.wrap-break': { 'overflow-wrap': 'break-word' },
        '.wrap-normal': { 'overflow-wrap': 'normal' },

        '.break-normal': { 'word-break': 'normal' },
        '.break-all': { 'word-break': 'break-all' },

        '.truncate': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        },
      },
      variants
    )
  }
}
