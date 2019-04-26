export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.align-self-auto': {
          'align-self': 'auto',
        },
        '.align-self-start': {
          'align-self': 'flex-start',
        },
        '.align-self-end': {
          'align-self': 'flex-end',
        },
        '.align-self-center': {
          'align-self': 'center',
        },
        '.align-self-stretch': {
          'align-self': 'stretch',
        },
      },
      variants('alignSelf')
    )
  }
}
