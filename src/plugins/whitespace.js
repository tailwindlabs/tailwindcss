export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.whitespace-normal': { 'white-space': 'normal' },
      '.whitespace-no-wrap': { 'white-space': 'nowrap' },
      '.whitespace-pre': { 'white-space': 'pre' },
      '.whitespace-pre-line': { 'white-space': 'pre-line' },
      '.whitespace-pre-wrap': { 'white-space': 'pre-wrap' },

      '.break-words': { 'word-wrap': 'break-word' },
      '.break-normal': { 'word-wrap': 'normal' },

      '.truncate': {
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
      },
    }, config('modules.whitespace'))
  }
}
