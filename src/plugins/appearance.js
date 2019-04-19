export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.appearance-none': { appearance: 'none' },
    },
    variants('appearance')
  )
}
