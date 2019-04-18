export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.antialiased': {
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        '.subpixel-antialiased': {
          '-webkit-font-smoothing': 'auto',
          '-moz-osx-font-smoothing': 'auto',
        },
      },
      variants('fontSmoothing')
    )
  }
}
