import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const colors = flattenColorPalette(theme('stroke'))

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [
          `.${e(`stroke-${modifier}`)}`,
          { stroke: value },
        ]
      })
    )

    addUtilities(utilities, variants('stroke'))
  }
}
