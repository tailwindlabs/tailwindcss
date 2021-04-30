import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'
import toColorValue from '../util/toColorValue'
import nameClass from '../util/nameClass'
import { asColor } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants, corePlugins }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('backgroundColor'))

      matchUtilities({
        bg: (modifier) => {
          let value = asColor(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          if (!corePlugins('backgroundOpacity')) {
            return {
              [nameClass('bg', modifier)]: {
                'background-color': value,
              },
            }
          }

          return {
            [nameClass('bg', modifier)]: withAlphaVariable({
              color: value,
              property: 'background-color',
              variable: '--tw-bg-opacity',
            }),
          }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('backgroundColor'))

      const getProperties = (value) => {
        if (corePlugins('backgroundOpacity')) {
          return withAlphaVariable({
            color: value,
            property: 'background-color',
            variable: '--tw-bg-opacity',
          })
        }

        return { 'background-color': toColorValue(value) }
      }

      const utilities = _.fromPairs(
        _.map(colors, (value, modifier) => {
          return [nameClass('bg', modifier), getProperties(value)]
        })
      )

      addUtilities(utilities, variants('backgroundColor'))
    }
  }
}
