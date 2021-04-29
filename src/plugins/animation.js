import _ from 'lodash'
import parseAnimationValue from '../util/parseAnimationValue'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants, prefix }) {
    if (config('mode') === 'jit') {
      let keyframes = Object.fromEntries(
        Object.entries(theme('keyframes')).map(([key, value]) => {
          return [
            key,
            [
              {
                [`@keyframes ${key}`]: value,
              },
              { respectVariants: false },
            ],
          ]
        })
      )

      matchUtilities({
        animate: [
          (modifier, { theme }) => {
            let value = theme.animation[modifier]

            if (value === undefined) {
              return []
            }

            let { name: animationName } = parseAnimationValue(value)

            return [
              keyframes[animationName],
              { [nameClass('animate', modifier)]: { animation: value } },
            ].filter(Boolean)
          },
        ],
      })
    } else {
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
}
