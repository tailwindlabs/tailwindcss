import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import castArray from 'lodash/castArray'
import transformThemeValue from './transformThemeValue'
import nameClass from '../util/nameClass'
import { asValue, asList, asColor, asAngle, asLength, asLookupValue } from '../util/pluginUtils'

let asMap = new Map([
  [asValue, 'any'],
  [asList, 'list'],
  [asColor, 'color'],
  [asAngle, 'angle'],
  [asLength, 'length'],
  [asLookupValue, 'lookup'],
])

export default function createUtilityPlugin(
  themeKey,
  utilityVariations = [[themeKey, [themeKey]]],
  { filterDefault = false, resolveArbitraryValue = asValue } = {}
) {
  const transformValue = transformThemeValue(themeKey)
  return function ({ config, matchUtilities2, addUtilities, variants, theme }) {
    if (config('mode') === 'jit') {
      for (let utilityVariation of utilityVariations) {
        let group = Array.isArray(utilityVariation[0]) ? utilityVariation : [utilityVariation]

        matchUtilities2(
          group.reduce((obj, [classPrefix, properties]) => {
            return Object.assign(obj, {
              [classPrefix]: (value) => {
                return properties.reduce(
                  (obj, name) => Object.assign(obj, { [name]: transformValue(value) }),
                  {}
                )
              },
            })
          }, {}),
          {
            values: filterDefault
              ? Object.fromEntries(
                  Object.entries(theme(themeKey)).filter(([modifier]) => modifier !== 'DEFAULT')
                )
              : theme(themeKey),
            variants: variants(themeKey),
            type: asMap.get(resolveArbitraryValue) ?? 'any',
          }
        )
      }
    } else {
      const pairs = toPairs(theme(themeKey))

      for (let utilityVariation of utilityVariations) {
        let group = Array.isArray(utilityVariation[0]) ? utilityVariation : [utilityVariation]
        let utilities = group.map(([classPrefix, properties]) => {
          return fromPairs(
            pairs
              .filter(([key]) => {
                return filterDefault ? key !== 'DEFAULT' : true
              })
              .map(([key, value]) => {
                return [
                  nameClass(classPrefix, key),
                  fromPairs(
                    castArray(properties).map((property) => [property, transformValue(value)])
                  ),
                ]
              })
          )
        })
        addUtilities(utilities, variants(themeKey))
      }
    }
  }
}
