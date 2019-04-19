import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(flattenColorPalette(theme('textColor')), (value, modifier) => [
      `.${e(`text-${modifier}`)}`,
      {
        color: value,
      },
    ])
  )

  addUtilities(utilities, variants('textColor'))
}
