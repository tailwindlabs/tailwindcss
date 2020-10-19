export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.break-normal': {
          'overflow-wrap': 'normal',
          'word-break': 'normal',
        },
        '.break-words': {
          'overflow-wrap': 'break-word',
        },
        '.break-all': { 'word-break': 'break-all' },
      },
      variants('wordBreak')
    )
  }
}
