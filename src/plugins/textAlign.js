export default function() {
  return function({ addUtilities, config }) {
    const textAlign = config('classesNames').textAlign

    addUtilities(
      {
        [`.${textAlign}-left`]: { 'text-align': 'left' },
        [`.${textAlign}-center`]: { 'text-align': 'center' },
        [`.${textAlign}-right`]: { 'text-align': 'right' },
        [`.${textAlign}-justify`]: { 'text-align': 'justify' },
      },
      config('variants.textAlign')
    )
  }
}
