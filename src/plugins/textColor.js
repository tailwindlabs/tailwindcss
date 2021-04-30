import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'
import nameClass from '../util/nameClass'
import { asColor } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants, corePlugins }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('textColor'))

      matchUtilities({
        text: (modifier) => {
          let value = asColor(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          if (!corePlugins('textOpacity')) {
            return {
              [nameClass('text', modifier)]: {
                color: value,
              },
            }
          }

          return {
            [nameClass('text', modifier)]: withAlphaVariable({
              color: value,
              property: 'color',
              variable: '--tw-text-opacity',
            }),
          }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('textColor'))

      const getProperties = (value) => {
        if (corePlugins('textOpacity')) {
          return withAlphaVariable({
            color: value,
            property: 'color',
            variable: '--tw-text-opacity',
          })
        }

        return { color: toColorValue(value) }
      }

      const utilities = _.fromPairs(
        _.map(colors, (value, modifier) => {
          return [nameClass('text', modifier), getProperties(value)]
        })
      )

      addUtilities(utilities, variants('textColor'))
    }
  }
}
