export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.border-collapse': { 'border-collapse': 'collapse' },
      '.border-separate': { 'border-collapse': 'separate' },
    },
    variants('borderCollapse')
  )
}
