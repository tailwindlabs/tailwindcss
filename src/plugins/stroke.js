import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, config, variants }) {
    const utilities = _.fromPairs(
      _.map(flattenColorPalette(config('theme.stroke')), (value, modifier) => {
        return [
          `.${e(`stroke-${modifier}`)}`,
          {
            stroke: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('stroke'))
  }
}
