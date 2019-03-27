export default function() {
  return function({ addUtilities, config }) {
    const borderCollapse = config('classesNames').borderCollapse

    addUtilities(
      {
        [`.${borderCollapse}-collapse`]: { 'border-collapse': 'collapse' },
        [`.${borderCollapse}-separate`]: { 'border-collapse': 'separate' },
      },
      config('variants.borderCollapse')
    )
  }
}
