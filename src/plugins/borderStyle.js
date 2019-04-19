export default () => ({ addUtilities, variants }) => {
  addUtilities(
    {
      '.border-solid': {
        'border-style': 'solid',
      },
      '.border-dashed': {
        'border-style': 'dashed',
      },
      '.border-dotted': {
        'border-style': 'dotted',
      },
      '.border-none': {
        'border-style': 'none',
      },
    },
    variants('borderStyle')
  )
}
