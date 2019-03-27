export default function() {
  return function({ addUtilities, config }) {
    addUtilities(
      {
        [`.${config('classesNames').appearance}-none`]: { appearance: 'none' },
      },
      config('variants.appearance')
    )
  }
}
