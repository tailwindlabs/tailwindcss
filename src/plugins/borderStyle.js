export default function() {
  return function({ addUtilities, config }) {
    const borderStyle = config('classesNames').borderStyle

    addUtilities(
      {
        [`.${borderStyle}-solid`]: {
          'border-style': 'solid',
        },
        [`.${borderStyle}-dashed`]: {
          'border-style': 'dashed',
        },
        [`.${borderStyle}-dotted`]: {
          'border-style': 'dotted',
        },
        [`.${borderStyle}-none`]: {
          'border-style': 'none',
        },
      },
      config('variants.borderStyle')
    )
  }
}
