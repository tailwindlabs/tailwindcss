import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(flattenColorPalette(theme('backgroundColor')), (value, modifier) => [
      `.${e(`bg-${modifier}`)}`,
      {
        'background-color': value,
      },
    ])
  )

  addUtilities(utilities, variants('backgroundColor'))
}
