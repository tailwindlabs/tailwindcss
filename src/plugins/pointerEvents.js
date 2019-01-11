export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.pointer-events-none': { 'pointer-events': 'none' },
        '.pointer-events-auto': { 'pointer-events': 'auto' },
      },
      config('modules.pointerEvents')
    )
  }
}
