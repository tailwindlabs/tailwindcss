export default function() {
  return function({ addUtilities, variants }) {
    addUtilities(
      {
        '.static': { position: 'static' },
        '.fixed': { position: 'fixed' },
        '.absolute': { position: 'absolute' },
        '.relative': { position: 'relative' },
        '.sticky': { position: 'sticky' },
      },
      variants('position')
    )
  }
}
