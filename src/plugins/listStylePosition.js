export default function() {
  return function({ addUtilities, config }) {
    const listStylePosition = config('classesNames').listStylePosition

    addUtilities(
      {
        [`.${listStylePosition}-inside`]: { 'list-style-position': 'inside' },
        [`.${listStylePosition}-outside`]: { 'list-style-position': 'outside' },
      },
      config('variants.listStylePosition')
    )
  }
}
