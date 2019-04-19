export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.resize-none': { resize: 'none' },
      '.resize-y': { resize: 'vertical' },
      '.resize-x': { resize: 'horizontal' },
      '.resize': { resize: 'both' },
    },
    variants('resize')
  )
}
