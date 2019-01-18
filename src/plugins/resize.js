export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.resize-none': { resize: 'none' },
        '.resize-y': { resize: 'vertical' },
        '.resize-x': { resize: 'horizontal' },
        '.resize': { resize: 'both' },
      },
      variants
    )
  }
}
