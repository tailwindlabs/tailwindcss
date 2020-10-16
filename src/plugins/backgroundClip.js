export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.bg-clip-border': { 'background-clip': 'border-box' },
        '.bg-clip-padding': { 'background-clip': 'padding-box' },
        '.bg-clip-content': { 'background-clip': 'content-box' },
        '.bg-clip-text': { 'background-clip': 'text' },
      },
      variants('backgroundClip')
    )
  }
}
