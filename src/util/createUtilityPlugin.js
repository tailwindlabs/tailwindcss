import transformThemeValue from './transformThemeValue'

export default function createUtilityPlugin(
  themeKey,
  utilityVariations = [[themeKey, [themeKey]]],
  { filterDefault = false, type = 'any' } = {}
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
          type,
        }
      )
    }
  }
}
