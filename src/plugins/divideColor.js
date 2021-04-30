import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'
import nameClass from '../util/nameClass'
import { asColor } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants, corePlugins }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('divideColor'))

      matchUtilities({
        divide: (modifier) => {
          if (modifier === 'DEFAULT') {
            return []
          }

          let value = asColor(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          if (!corePlugins('divideOpacity')) {
            return {
              [`${nameClass('divide', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
                'border-color': value,
              },
            }
          }

          return {
            [`${nameClass(
              'divide',
              modifier
            )} > :not([hidden]) ~ :not([hidden])`]: withAlphaVariable({
              color: colorPalette[modifier],
              property: 'border-color',
              variable: '--tw-divide-opacity',
            }),
          }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('divideColor'))

      const getProperties = (value) => {
        if (corePlugins('divideOpacity')) {
          return withAlphaVariable({
            color: value,
            property: 'border-color',
            variable: '--tw-divide-opacity',
          })
        }

        return { 'border-color': toColorValue(value) }
      }

      const utilities = _.fromPairs(
        _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
          return [
            `${nameClass('divide', modifier)} > :not([hidden]) ~ :not([hidden])`,
            getProperties(value),
          ]
        })
      )

      addUtilities(utilities, variants('divideColor'))
    }
  }
}
