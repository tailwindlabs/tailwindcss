import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'

function className(classPrefix, key) {
  if (key === 'default') {
    return classPrefix
  }

  if (key.startsWith('-')) {
    return `-${classPrefix}${key}`
  }

  return `${classPrefix}-${key}`
}

export default function createUtilityPlugin(
  classPrefix,
  themeKey,
  property = themeKey
) {
  return function({ e, addUtilities, variants, theme }) {
    return addUtilities(
      fromPairs(
        toPairs(theme(themeKey)).map(([key, value]) => {
          return [`.${e(className(classPrefix, key))}`, { [property]: value }]
        })
      ),
      variants(themeKey)
    )
  }
}
