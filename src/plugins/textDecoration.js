export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.underline': { 'text-decoration': 'underline' },
      '.line-through': { 'text-decoration': 'line-through' },
      '.no-underline': { 'text-decoration': 'none' },
    },
    variants('textDecoration')
  )
}
