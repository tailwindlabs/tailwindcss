import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(flattenColorPalette(theme('fill')), (value, modifier) => [
      `.${e(`fill-${modifier}`)}`,
      {
        fill: value,
      },
    ])
  )

  addUtilities(utilities, variants('fill'))
}
