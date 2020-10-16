import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function() {
  return function({ addUtilities, theme, variants }) {
    const keyframesConfig = theme('keyframes')
    const keyframesStyles = _.fromPairs(
      _.toPairs(keyframesConfig).map(([name, keyframes]) => {
        return [`@keyframes ${name}`, keyframes]
      })
    )
    addUtilities(keyframesStyles, { respectImportant: false })

    const animationConfig = theme('animation')
    const utilities = _.fromPairs(
      _.toPairs(animationConfig).map(([suffix, animation]) => {
        return [
          nameClass('animate', suffix),
          {
            animation,
          },
        ]
      })
    )
    addUtilities(utilities, variants('animation'))
  }
}
