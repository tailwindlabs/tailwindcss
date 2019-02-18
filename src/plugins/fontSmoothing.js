export default function({ variants }) {
  return function({ addUtilities }) {
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
      variants
    )
  }
}
