export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.underline': { 'text-decoration': 'underline' },
        '.overline': { 'text-decoration': 'overline' },
        '.line-through': { 'text-decoration': 'line-through' },
        '.underline.overline': { 'text-decoration': 'underline overline' },
        '.underline.line-through': {
          'text-decoration': 'underline line-through',
        },
        '.overline.line-through': {
          'text-decoration': 'overline line-through',
        },
        '.underline.overline.line-through': {
          'text-decoration': 'underline overline line-through',
        },
        '.no-underline': { 'text-decoration': 'none' },
      },
      variants('textDecoration')
    )
  }
}
