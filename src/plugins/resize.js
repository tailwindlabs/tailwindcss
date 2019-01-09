export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.resize-none': { resize: 'none' },
      '.resize-y': { resize: 'vertical' },
      '.resize-x': { resize: 'horizontal' },
      '.resize': { resize: 'both' },
    }, config('modules.resize'))
  }
}
