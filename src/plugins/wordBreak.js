export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.break-normal': {
          'overflow-wrap': 'normal',
          'word-break': 'normal',
          'white-space': 'normal',
        },
        '.break-words': { 'overflow-wrap': 'break-word', 'white-space': 'normal' },
        '.break-all': { 'word-break': 'break-all', 'white-space': 'normal' },

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
