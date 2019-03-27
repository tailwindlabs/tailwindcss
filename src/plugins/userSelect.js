export default function() {
  return function({ addUtilities, config }) {
    const userSelect = config('classesNames').userSelect

    addUtilities(
      {
        [`.${userSelect}-none`]: { 'user-select': 'none' },
        [`.${userSelect}-text`]: { 'user-select': 'text' },
      },
      config('variants.userSelect')
    )
  }
}
