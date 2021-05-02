import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import nameClass from '../util/nameClass'
import { asValue } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('fill'))

      matchUtilities({
        fill: (modifier) => {
          let value = asValue(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          return { [nameClass('fill', modifier)]: { fill: toColorValue(value) } }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('fill'))

      const utilities = _.fromPairs(
        _.map(colors, (value, modifier) => {
          return [nameClass('fill', modifier), { fill: toColorValue(value) }]
        })
      )

      addUtilities(utilities, variants('fill'))
    }
  }
}
