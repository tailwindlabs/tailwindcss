import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants, corePlugins }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('placeholderColor'))

      matchUtilities({
        placeholder: (modifier) => {
          let value = asValue(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          if (!corePlugins('placeholderOpacity')) {
            return {
              [`${nameClass('placeholder', modifier)}::placeholder`]: {
                color: value,
              },
            }
          }

          return {
            [`${nameClass('placeholder', modifier)}::placeholder`]: withAlphaVariable({
              color: value,
              property: 'color',
              variable: '--tw-placeholder-opacity',
            }),
          }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('placeholderColor'))

      const getProperties = (value) => {
        if (corePlugins('placeholderOpacity')) {
          return withAlphaVariable({
            color: value,
            property: 'color',
            variable: '--tw-placeholder-opacity',
          })
        }

        return { color: toColorValue(value) }
      }

      const utilities = _.fromPairs(
        _.map(colors, (value, modifier) => {
          return [`${nameClass('placeholder', modifier)}::placeholder`, getProperties(value)]
        })
      )

      addUtilities(utilities, variants('placeholderColor'))
    }
  }
}
