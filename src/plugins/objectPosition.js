export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.object-bottom': { 'object-position': 'bottom' },
        '.object-center': { 'object-position': 'center' },
        '.object-left': { 'object-position': 'left' },
        '.object-left-bottom': { 'object-position': 'left bottom' },
        '.object-left-top': { 'object-position': 'left top' },
        '.object-right': { 'object-position': 'right' },
        '.object-right-bottom': { 'object-position': 'right bottom' },
        '.object-right-top': { 'object-position': 'right top' },
        '.object-top': { 'object-position': 'top' },
      },
      variants
    )
  }
}
