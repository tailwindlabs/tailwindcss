import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'
import nameClass from '../util/nameClass'
import { asColor } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants, corePlugins }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('borderColor'))

      matchUtilities({
        border: (modifier) => {
          if (modifier === 'DEFAULT') {
            return []
          }

          let value = asColor(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          if (!corePlugins('borderOpacity')) {
            return {
              [nameClass('border', modifier)]: {
                'border-color': value,
              },
            }
          }

          return {
            [nameClass('border', modifier)]: withAlphaVariable({
              color: value,
              property: 'border-color',
              variable: '--tw-border-opacity',
            }),
          }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('borderColor'))

      const getProperties = (value) => {
        if (corePlugins('borderOpacity')) {
          return withAlphaVariable({
            color: value,
            property: 'border-color',
            variable: '--tw-border-opacity',
          })
        }

        return { 'border-color': toColorValue(value) }
      }

      const utilities = _.fromPairs(
        _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
          return [nameClass('border', modifier), getProperties(value)]
        })
      )

      addUtilities(utilities, variants('borderColor'))
    }
  }
}
