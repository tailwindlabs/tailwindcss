import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const colors = flattenColorPalette(theme('fill'))

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [
          `.${e(`fill-${modifier}`)}`,
          { fill: value },
        ]
      })
    )

    addUtilities(utilities, variants('fill'))
  }
}
