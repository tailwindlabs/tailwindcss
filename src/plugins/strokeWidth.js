import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(flattenColorPalette(theme('strokeWidth')), (value, modifier) => {
        return [
          `.${e(`stroke-w-${modifier}`)}`,
          {
            'stroke-width': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('strokeWidth'))
  }
}
