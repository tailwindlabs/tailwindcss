const { nameClass } = require('../pluginUtils')
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default
const parseAnimationValue = require('tailwindcss/lib/util/parseAnimationValue').default

module.exports = function ({ matchUtilities, jit: { theme } }) {
  let keyframes = Object.fromEntries(
    Object.entries(theme.keyframes).map(([key, value]) => {
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

  let transformValue = transformThemeValue('animation')
  matchUtilities({
    animate: [
      (modifier, { theme }) => {
        let value = transformValue(theme.animation[modifier])

        if (modifier === '' || value === undefined) {
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
}
