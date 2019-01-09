export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.outline-none': { outline: '0' },
    }, config('modules.outline'))
  }
}
