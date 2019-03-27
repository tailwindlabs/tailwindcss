export default function() {
  return function({ addUtilities, config }) {
    const classesNames = config('classesNames')
    const position = classesNames.position

    addUtilities(
      {
        [`.${position}static`]: { position: 'static' },
        [`.${position}fixed`]: { position: 'fixed' },
        [`.${position}absolute`]: { position: 'absolute' },
        [`.${position}relative`]: { position: 'relative' },
        [`.${position}sticky`]: { position: 'sticky' },
      },
      config('variants.position')
    )
  }
}
