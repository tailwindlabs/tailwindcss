export default function() {
  return function({ addUtilities, config }) {
    const visibility = config('classesNames').visibility

    addUtilities(
      {
        [`.${visibility}visible`]: { visibility: 'visible' },
        [`.${visibility}invisible`]: { visibility: 'hidden' },
      },
      config('variants.visibility')
    )
  }
}
