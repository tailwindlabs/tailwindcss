export default function() {
  return function({ addUtilities, variants, target }) {
    addUtilities(
      {
        '.bg-clip-border': { 'background-clip': 'border-box' },
        '.bg-clip-padding': { 'background-clip': 'padding-box' },
        '.bg-clip-content': { 'background-clip': 'content-box' },
        ...(target('display') === 'ie11'
          ? {}
          : {
              '.bg-clip-text': { 'background-clip': 'text' },
            }),
      },
      variants('backgroundClip')
    )
  }
}
