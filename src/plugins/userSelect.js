export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.select-none': { 'user-select': 'none' },
        '.select-text': { 'user-select': 'text' },
      },
      config('modules.userSelect')
    )
  }
}
