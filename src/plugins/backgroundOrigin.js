export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.bg-origin-border': { 'background-origin': 'border-box' },
        '.bg-origin-padding': { 'background-origin': 'padding-box' },
        '.bg-origin-content': { 'background-origin': 'content-box' },
      },
      variants('backgroundOrigin')
    )
  }
}
