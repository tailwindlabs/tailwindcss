export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        '.border-solid': {
          'border-style': 'solid',
        },
        '.border-dashed': {
          'border-style': 'dashed',
        },
        '.border-dotted': {
          'border-style': 'dotted',
        },
        '.border-none': {
          'border-style': 'none',
        },
      },
      config('modules.borderStyle')
    )
  }
}
