export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.bg-fixed': { 'background-attachment': 'fixed' },
      '.bg-local': { 'background-attachment': 'local' },
      '.bg-scroll': { 'background-attachment': 'scroll' },
    },
    variants('backgroundAttachment')
  )
}
