import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import castArray from 'lodash/castArray'

function className(classPrefix, key) {
  if (key === 'default') {
    return classPrefix
  }

  if (key.startsWith('-')) {
    return `-${classPrefix}${key}`
  }

  return `${classPrefix}-${key}`
}

export default function createUtilityPlugin(themeKey, utilityVariations) {
  return function({ e, addUtilities, variants, theme }) {
    const utilities = utilityVariations.map(([classPrefix, properties]) => {
      return fromPairs(
        toPairs(theme(themeKey)).map(([key, value]) => {
          return [
            `.${e(className(classPrefix, key))}`,
            fromPairs(castArray(properties).map(property => [property, value])),
          ]
        })
      )
    })
    return addUtilities(utilities, variants(themeKey))
  }
}
