export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.justify-start': {
          'justify-content': 'flex-start',
        },
        '.justify-end': {
          'justify-content': 'flex-end',
        },
        '.justify-center': {
          'justify-content': 'center',
        },
        '.justify-between': {
          'justify-content': 'space-between',
        },
        '.justify-around': {
          'justify-content': 'space-around',
        },
      },
      variants
    )
  }
}
