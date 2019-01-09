export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.visible': { visibility: 'visible' },
      '.invisible': { visibility: 'hidden' },
    }, config('modules.visibility'))
  }
}
