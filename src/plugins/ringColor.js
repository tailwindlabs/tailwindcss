import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'
import nameClass from '../util/nameClass'
import { asColor } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('ringColor'))

      matchUtilities({
        ring: (modifier) => {
          if (modifier === 'DEFAULT') {
            return []
          }

          let value = asColor(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('ring', modifier)]: withAlphaVariable({
              color: value,
              property: '--tw-ring-color',
              variable: '--tw-ring-opacity',
            }),
          }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('ringColor'))

      const getProperties = (value) => {
        return withAlphaVariable({
          color: value,
          property: '--tw-ring-color',
          variable: '--tw-ring-opacity',
        })
      }

      const utilities = _.fromPairs(
        _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
          return [nameClass('ring', modifier), getProperties(value)]
        })
      )

      addUtilities(utilities, variants('ringColor'))
    }
  }
}
