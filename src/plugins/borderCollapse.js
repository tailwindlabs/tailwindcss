export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.border-collapse': { 'border-collapse': 'collapse' },
        '.border-separate': { 'border-collapse': 'separate' },
      },
      config('modules.borderCollapse')
    )
  }
}
