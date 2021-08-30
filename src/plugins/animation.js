import parseAnimationValue from '../util/parseAnimationValue'

export default function () {
  return function ({ matchUtilities, theme, variants, prefix }) {
    let prefixName = (name) => prefix(`.${name}`).slice(1)
    let keyframes = Object.fromEntries(
      Object.entries(theme('keyframes') ?? {}).map(([key, value]) => {
        return [
          key,
          [
            {
              [`@keyframes ${prefixName(key)}`]: value,
            },
          ],
        ]
      })
    )

    matchUtilities(
      {
        animate: (value, { includeRules }) => {
          let animations = parseAnimationValue(value)

          for (let { name } of animations) {
            if (keyframes[name] !== undefined) {
              includeRules(keyframes[name], { respectImportant: false })
            }
          }

          return {
            animation: animations
              .map(({ name, value }) => {
                if (name === undefined || keyframes[name] === undefined) {
                  return value
                }
                return value.replace(name, prefixName(name))
              })
              .join(', '),
          }
        },
      },
      { values: theme('animation'), variants: variants('animation') }
    )
  }
}
