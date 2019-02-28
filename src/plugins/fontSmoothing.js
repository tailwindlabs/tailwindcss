export default function() {
  return function({ addUtilities, config }) {
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
      config('variants.fontSmoothing')
    )
  }
}
