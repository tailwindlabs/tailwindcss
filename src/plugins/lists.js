export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.list-reset': {
          'list-style': 'none',
          padding: '0',
        },
      },
      config('modules.lists')
    )
  }
}
