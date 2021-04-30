import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import castArray from 'lodash/castArray'
import transformThemeValue from './transformThemeValue'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function createUtilityPlugin(
  themeKey,
  utilityVariations = [[themeKey, [themeKey]]],
  { filterDefault = false, resolveArbitraryValue = asValue } = {}
) {
  const transformValue = transformThemeValue(themeKey)
  return function ({ config, matchUtilities, addUtilities, variants, theme }) {
    if (config('mode') === 'jit') {
      for (let utilityVariation of utilityVariations) {
        let group = Array.isArray(utilityVariation[0]) ? utilityVariation : [utilityVariation]

        matchUtilities(
          group.reduce((obj, [classPrefix, properties]) => {
            return Object.assign(obj, {
              [classPrefix]: (modifier, { theme }) => {
                let value = resolveArbitraryValue(modifier, theme[themeKey])

                if (value === undefined) {
                  return []
                }

                return {
                  [nameClass(classPrefix, modifier)]: properties.reduce(
                    (obj, name) => Object.assign(obj, { [name]: transformValue(value) }),
                    {}
                  ),
                }
              },
            })
          }, {})
        )
      }
    } else {
      const pairs = toPairs(theme(themeKey))
      const utilities = utilityVariations.flatMap((utilityVariation) => {
        let group = Array.isArray(utilityVariation[0]) ? utilityVariation : [utilityVariation]
        return group.map(([classPrefix, properties]) => {
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
      })

      return addUtilities(utilities, variants(themeKey))
    }
  }
}
