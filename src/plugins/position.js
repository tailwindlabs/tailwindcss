export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.static': { position: 'static' },
        '.fixed': { position: 'fixed' },
        '.absolute': { position: 'absolute' },
        '.relative': { position: 'relative' },
        '.sticky': { position: 'sticky' },
        '.pin-none': {
          top: 'auto',
          right: 'auto',
          bottom: 'auto',
          left: 'auto',
        },
        '.pin': {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        '.pin-y': { top: 0, bottom: 0 },
        '.pin-x': { right: 0, left: 0 },
        '.pin-t': { top: 0 },
        '.pin-r': { right: 0 },
        '.pin-b': { bottom: 0 },
        '.pin-l': { left: 0 },
      },
      config('modules.position')
    )
  }
}
