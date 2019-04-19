export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.pointer-events-none': { 'pointer-events': 'none' },
      '.pointer-events-auto': { 'pointer-events': 'auto' },
    },
    variants('pointerEvents')
  )
}
