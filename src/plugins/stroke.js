import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import toColorValue from '../util/toColorValue'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const colors = flattenColorPalette(theme('stroke'))

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [nameClass('stroke', modifier), { stroke: toColorValue(value) }]
      })
    )

    addUtilities(utilities, variants('stroke'))
  }
}
