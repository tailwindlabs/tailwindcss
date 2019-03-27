export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        [`.${config('classesNames').outline}-none`]: { outline: '0' },
      },
      config('variants.outline')
    )
  }
}
