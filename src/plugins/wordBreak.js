export default function() {
  return function({ addUtilities, variants, target }) {
    const wrapPropertyName = target('wordBreak') === 'ie11' ? 'word-wrap' : 'overflow-wrap'

    addUtilities(
      {
        '.break-normal': {
          [wrapPropertyName]: 'normal',
          'word-break': 'normal',
        },
        '.break-words': { [wrapPropertyName]: 'break-word' },
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
