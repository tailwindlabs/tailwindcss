export default function({ variants }) {
  return function({ addUtilities }) {
    addUtilities(
      {
        '.pointer-events-none': { 'pointer-events': 'none' },
        '.pointer-events-auto': { 'pointer-events': 'auto' },
      },
      variants
    )
  }
}
