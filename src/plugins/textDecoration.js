export default function() {
  return function({ addUtilities, config }) {
    const textDecoration = config('classesNames').textDecoration

    addUtilities(
      {
        [`.${textDecoration}underline`]: { 'text-decoration': 'underline' },
        [`.${textDecoration}line-through`]: { 'text-decoration': 'line-through' },
        [`.${textDecoration}no-underline`]: { 'text-decoration': 'none' },
      },
      config('variants.textDecoration')
    )
  }
}
