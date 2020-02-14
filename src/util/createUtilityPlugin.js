import _ from 'lodash'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import castArray from 'lodash/castArray'

function className(classPrefix, key) {
  if (key === '') {
    return classPrefix
  }

  if (key.startsWith('-')) {
    return `-${classPrefix}${key}`
  }

  return `${classPrefix}-${key}`
}

export default function createUtilityPlugin(themeKey, utilityVariations, mapTheme = theme => theme) {
  return function({ e, addUtilities, variants, theme }) {
    const utilities = utilityVariations.map(([classPrefix, properties]) => {
      return fromPairs(
        toPairs(mapTheme(theme(themeKey))).map(([key, value]) => {
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

export function convertDefaultKey(theme) {
  return _.mapKeys(theme, (value, key) => key === 'default' ? '' : key)
}
