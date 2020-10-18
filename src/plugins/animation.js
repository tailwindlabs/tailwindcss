import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const keyframesConfig = theme('keyframes')
    const keyframesStyles = _.mapKeys(keyframesConfig, (_keyframes, name) => `@keyframes ${name}`)
    addUtilities(keyframesStyles, { respectImportant: false })

    const animationConfig = theme('animation')
    const utilities = _.mapValues(
      _.mapKeys(animationConfig, (_animation, suffix) => nameClass('animate', suffix)),
      (animation) => ({ animation })
    )
    addUtilities(utilities, variants('animation'))
  }
}
