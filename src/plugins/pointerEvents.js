export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.pointer-events-none': { 'pointer-events': 'none' },
        '.pointer-events-auto': { 'pointer-events': 'auto' },
      },
      variants('pointerEvents')
    )
  }
}
