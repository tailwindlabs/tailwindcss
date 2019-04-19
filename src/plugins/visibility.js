export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.visible': { visibility: 'visible' },
      '.invisible': { visibility: 'hidden' },
    },
    variants('visibility')
  )
}
