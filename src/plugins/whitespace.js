export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.whitespace-normal': { 'white-space': 'normal' },
        '.whitespace-no-wrap': { 'white-space': 'nowrap' },
        '.whitespace-pre': { 'white-space': 'pre' },
        '.whitespace-pre-line': { 'white-space': 'pre-line' },
        '.whitespace-pre-wrap': { 'white-space': 'pre-wrap' },

        '.break-normal': {
          'overflow-wrap': 'normal',
          'word-break': 'normal',
        },
        '.break-words': { 'overflow-wrap': 'break-word' },
        '.break-all': { 'word-break': 'break-all' },

        '.truncate': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        },
      },
      config('variants.whitespace')
    )
  }
}
