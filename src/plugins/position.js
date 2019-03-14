export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.static': { position: 'static' },
        '.fixed': { position: 'fixed' },
        '.absolute': { position: 'absolute' },
        '.relative': { position: 'relative' },
        '.sticky': { position: 'sticky' },
      },
      config('variants.position')
    )
  }
}
