export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.italic': { 'font-style': 'italic' },
      '.not-italic': { 'font-style': 'normal' },
    },
    variants('fontStyle')
  )
}
