export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
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
        '.justify-self-baseline': {
          'justify-self': 'baseline',
        },
      },
      variants('justifySelf')
    )
  }
}
