import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import nameClass from '../util/nameClass'
import { asColor } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('stroke'))

      matchUtilities({
        stroke: (modifier) => {
          let value = asColor(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          return { [nameClass('stroke', modifier)]: { stroke: toColorValue(value) } }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('stroke'))

      const utilities = _.fromPairs(
        _.map(colors, (value, modifier) => {
          return [nameClass('stroke', modifier), { stroke: toColorValue(value) }]
        })
      )

      addUtilities(utilities, variants('stroke'))
    }
  }
}
