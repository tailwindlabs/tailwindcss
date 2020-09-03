export default function() {
  return function({ addUtilities, variants, target }) {
    if (target('justifySelf') === 'ie11') {
      return
    }

    addUtilities(
      {
        '.justify-self-auto': {
          'justify-self': 'auto',
        },
        '.justify-self-start': {
          'justify-self': 'start',
        },
        '.justify-self-end': {
          'justify-self': 'end',
        },
        '.justify-self-center': {
          'justify-self': 'center',
        },
        '.justify-self-stretch': {
          'justify-self': 'stretch',
        },
      },
      variants('justifySelf')
    )
  }
}
