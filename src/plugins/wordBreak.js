export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.break-normal': {
          // For IE 11, remove 'word-wrap' when we have a 'modern' mode
          'word-wrap': 'normal',
          'overflow-wrap': 'normal',
          'word-break': 'normal',
        },
        '.break-words': {
          // For IE 11, remove 'word-wrap' when we have a 'modern' mode
          'word-wrap': 'break-word',
          'overflow-wrap': 'break-word',
        },
        '.break-all': { 'word-break': 'break-all' },

        '.truncate': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        },
      },
      variants('wordBreak')
    )
  }
}
