import transformThemeValue from './transformThemeValue'
import { asValue, asColor, asAngle, asLength, asURL, asLookupValue } from '../util/pluginUtils'

let asMap = new Map([
  [asValue, 'any'],
  [asColor, 'color'],
  [asAngle, 'angle'],
  [asLength, 'length'],
  [asURL, 'url'],
  [asLookupValue, 'lookup'],
])

export default function createUtilityPlugin(
  themeKey,
  utilityVariations = [[themeKey, [themeKey]]],
  { filterDefault = false, resolveArbitraryValue = asValue } = {}
) {
  let transformValue = transformThemeValue(themeKey)
  return function ({ matchUtilities, theme }) {
    for (let utilityVariation of utilityVariations) {
      let group = Array.isArray(utilityVariation[0]) ? utilityVariation : [utilityVariation]

      matchUtilities(
        group.reduce((obj, [classPrefix, properties]) => {
          return Object.assign(obj, {
            [classPrefix]: (value) => {
              return properties.reduce((obj, name) => {
                if (Array.isArray(name)) {
                  return Object.assign(obj, { [name[0]]: name[1] })
                }
                return Object.assign(obj, { [name]: transformValue(value) })
              }, {})
            },
          })
        }, {}),
        {
          values: filterDefault
            ? Object.fromEntries(
                Object.entries(theme(themeKey) ?? {}).filter(([modifier]) => modifier !== 'DEFAULT')
              )
            : theme(themeKey),
          type: Array.isArray(resolveArbitraryValue)
            ? resolveArbitraryValue.map((typeResolver) => asMap.get(typeResolver) ?? 'any')
            : asMap.get(resolveArbitraryValue) ?? 'any',
        }
      )
    }
  }
}
