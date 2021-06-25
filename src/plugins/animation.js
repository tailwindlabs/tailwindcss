import parseAnimationValue from '../util/parseAnimationValue'

const COMMA = /\,(?![^(]*\))/g
const COMMA_PLAIN = ','

export default function () {
  return function ({ matchUtilities, theme, variants, prefix }) {
    let prefixName = (name) => prefix(`.${name}`).slice(1)
    let keyframes = Object.fromEntries(
      Object.entries(theme('keyframes')).map(([key, value]) => {
        return [
          key,
          [
            {
              [`@keyframes ${prefixName(key)}`]: value,
            },
            { respectVariants: false },
          ],
        ]
      })
    )

    matchUtilities(
      {
        animate: (value, { includeRules }) => {
          let parsed = parseAnimationValue(value)

          if (Array.isArray(parsed)) {
            let animationNames = parsed.map((animation) => animation.name)
            let animations = value.split(COMMA)

            animationNames.forEach((animationName) => {
              if (keyframes[animationName] !== undefined) {
                includeRules(keyframes[animationName], { respectImportant: false })
              }
            })

            if (
              animationNames.every(
                (animationName) =>
                  animationName === undefined || keyframes[animationName] === undefined
              )
            ) {
              return { animation: value }
            }

            return {
              animation: animations
                .map((animation, i) =>
                  animation.replace(animationNames[i], prefixName(animationNames[i]))
                )
                .join(COMMA_PLAIN),
            }
          } else {
            let { name: animationName } = parsed

            if (keyframes[animationName] !== undefined) {
              includeRules(keyframes[animationName], { respectImportant: false })
            }

            if (animationName === undefined || keyframes[animationName] === undefined) {
              return { animation: value }
            }

            return {
              animation: value.replace(animationName, prefixName(animationName)),
            }
          }
        },
      },
      { values: theme('animation'), variants: variants('animation') }
    )
  }
}
