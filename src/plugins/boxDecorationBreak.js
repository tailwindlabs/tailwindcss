export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.decoration-slice': {
          'box-decoration-break': 'slice',
        },
        '.decoration-clone': {
          'box-decoration-break': 'clone',
        },
      },
      variants('boxDecorationBreak')
    )
  }
}
