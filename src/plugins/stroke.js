import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(flattenColorPalette(theme('stroke')), (value, modifier) => [
      `.${e(`stroke-${modifier}`)}`,
      {
        stroke: value,
      },
    ])
  )

  addUtilities(utilities, variants('stroke'))
}
