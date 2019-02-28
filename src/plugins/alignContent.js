export default function() {
  return function({ addUtilities, config }) {
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
      },
      config('variants.alignContent')
    )
  }
}
