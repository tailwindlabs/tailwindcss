export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.content-center': {
          'align-content': 'center',
        },
        '.content-start': {
          'align-content': 'flex-start',
        },
        '.content-end': {
          'align-content': 'flex-end',
        },
        '.content-between': {
          'align-content': 'space-between',
        },
        '.content-around': {
          'align-content': 'space-around',
        },
        '.flex-1': {
          flex: '1 1 0%',
        },
        '.flex-auto': {
          flex: '1 1 auto',
        },
        '.flex-initial': {
          flex: '0 1 auto',
        },
        '.flex-none': {
          flex: 'none',
        },
        '.flex-grow': {
          'flex-grow': '1',
        },
        '.flex-shrink': {
          'flex-shrink': '1',
        },
        '.flex-grow-0': {
          'flex-grow': '0',
        },
        '.flex-shrink-0': {
          'flex-shrink': '0',
        },
      },
      variants
    )
  }
}
