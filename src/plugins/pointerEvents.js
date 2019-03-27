export default function() {
  return function({ addUtilities, config }) {
    const pointerEvents = config('classesNames').pointerEvents

    addUtilities(
      {
        [`.${pointerEvents}-none`]: { 'pointer-events': 'none' },
        [`.${pointerEvents}-auto`]: { 'pointer-events': 'auto' },
      },
      config('variants.pointerEvents')
    )
  }
}
