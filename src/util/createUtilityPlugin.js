import identity from 'lodash/identity'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import castArray from 'lodash/castArray'
import nameClass from './nameClass'

export default function createUtilityPlugin(themeKey, utilityVariations) {
  return function ({ addUtilities, variants, theme }) {
    const utilities = utilityVariations.map(
      ([classPrefix, properties, transformValue = identity]) => {
        return fromPairs(
          toPairs(theme(themeKey)).map(([key, value]) => {
            return [
              nameClass(classPrefix, key),
              fromPairs(castArray(properties).map(property => [property, transformValue(value)])),
            ]
          })
        )
      }
    )
    return addUtilities(utilities, variants(themeKey))
  }
}
