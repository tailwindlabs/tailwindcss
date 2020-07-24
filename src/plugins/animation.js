export default function() {
  return function({ addBase, addUtilities, e, theme, variants }) {
    const keyframesConfig = theme('keyframes')
    const keyframesStyles = Object.fromEntries(
      Object.entries(keyframesConfig).map(([name, keyframes]) => {
        return [`@keyframes ${name}`, keyframes]
      })
    )
    addBase(keyframesStyles)

    const animationConfig = theme('animation')
    const utilities = Object.fromEntries(
      Object.entries(animationConfig).map(([suffix, animation]) => {
        return [
          `.${e(`animate-${suffix}`)}`,
          {
            animation,
          },
        ]
      })
    )
    addUtilities(utilities, variants('animation'))
  }
}
