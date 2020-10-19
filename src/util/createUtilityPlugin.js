import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import castArray from 'lodash/castArray'
import nameClass from './nameClass'
import transformThemeValue from './transformThemeValue'

export default function createUtilityPlugin(themeKey, utilityVariations) {
  const transformValue = transformThemeValue(themeKey)
  return function ({ addUtilities, variants, theme }) {
    const pairs = toPairs(theme(themeKey))
    const utilities = utilityVariations.map(([classPrefix, properties]) => {
      return fromPairs(
        pairs.map(([key, value]) => {
          return [
            nameClass(classPrefix, key),
            fromPairs(castArray(properties).map((property) => [property, transformValue(value)])),
          ]
        })
      )
    })
    return addUtilities(utilities, variants(themeKey))
  }
}
