export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.outline-none': { outline: '0' },
    },
    variants('outline')
  )
}
