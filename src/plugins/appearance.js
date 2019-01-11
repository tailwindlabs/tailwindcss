export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.appearance-none': { appearance: 'none' },
      },
      config('modules.appearance')
    )
  }
}
