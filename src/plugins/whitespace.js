export default function() {
  return function({ addUtilities, config }) {
    const classesNames = config('classesNames')
    const whitespace = classesNames.whitespace

    addUtilities(
      {
        [`.${whitespace}-normal`]: { 'white-space': 'normal' },
        [`.${whitespace}-no-wrap`]: { 'white-space': 'nowrap' },
        [`.${whitespace}-pre`]: { 'white-space': 'pre' },
        [`.${whitespace}-pre-line`]: { 'white-space': 'pre-line' },
        [`.${whitespace}-pre-wrap`]: { 'white-space': 'pre-wrap' },
      },
      config('variants.whitespace')
    )
  }
}
