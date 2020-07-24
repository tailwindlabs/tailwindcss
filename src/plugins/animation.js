import _ from 'lodash'

export default function() {
  return function({ addBase, addUtilities, e, theme, variants }) {
    const keyframesConfig = theme('keyframes')
    const keyframesStyles = _.fromPairs(
      _.toPairs(keyframesConfig).map(([name, keyframes]) => {
        return [`@keyframes ${name}`, keyframes]
      })
    )
    addBase(keyframesStyles)

    const animationConfig = theme('animation')
    const utilities = _.fromPairs(
      _.toPairs(animationConfig).map(([suffix, animation]) => {
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
