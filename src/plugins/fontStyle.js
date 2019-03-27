export default function() {
  return function({ addUtilities, config }) {
    const fontStyle = config('classesNames').fontStyle

    addUtilities(
      {
        [`.${fontStyle}italic`]: { 'font-style': 'italic' },
        [`.${fontStyle}not-italic`]: { 'font-style': 'normal' },
      },
      config('variants.fontStyle')
    )
  }
}
