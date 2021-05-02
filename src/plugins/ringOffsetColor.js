import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import nameClass from '../util/nameClass'
import { asColor } from '../util/pluginUtils'

export default function () {
  return function ({ config, matchUtilities, addUtilities, theme, variants }) {
    if (config('mode') === 'jit') {
      let colorPalette = flattenColorPalette(theme('ringOffsetColor'))

      matchUtilities({
        'ring-offset': (modifier) => {
          let value = asColor(modifier, colorPalette)

          if (value === undefined) {
            return []
          }

          return {
            [nameClass('ring-offset', modifier)]: {
              '--tw-ring-offset-color': toColorValue(value),
            },
          }
        },
      })
    } else {
      const colors = flattenColorPalette(theme('ringOffsetColor'))
      const utilities = _.fromPairs(
        _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
          return [
            nameClass('ring-offset', modifier),
            {
              '--tw-ring-offset-color': toColorValue(value),
            },
          ]
        })
      )
      addUtilities(utilities, variants('ringOffsetColor'))
    }
  }
}
