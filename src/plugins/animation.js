import _ from 'lodash'
import nameClass from '../util/nameClass'
import parseAnimationValue from '../util/parseAnimationValue'

export default function () {
  return function ({ addUtilities, theme, variants, prefix }) {
    const prefixName = (name) => prefix(`.${name}`).slice(1)
    const keyframesConfig = theme('keyframes')
    const keyframesStyles = _.mapKeys(
      keyframesConfig,
      (_keyframes, name) => `@keyframes ${prefixName(name)}`
    )

    addUtilities(keyframesStyles, { respectImportant: false })

    const animationConfig = theme('animation')
    const utilities = _.mapValues(
      _.mapKeys(animationConfig, (_animation, suffix) => nameClass('animate', suffix)),
      (animation) => {
        const { name } = parseAnimationValue(animation)
        if (name === undefined || keyframesConfig[name] === undefined) return { animation }
        return { animation: animation.replace(name, prefixName(name)) }
      }
    )
    addUtilities(utilities, variants('animation'))
  }
}
