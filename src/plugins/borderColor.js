import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const colors = flattenColorPalette(theme('borderColor'))

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'default'), (value, modifier) => {
        return [
          `.${e(`border-${modifier}`)}`,
          {
            'border-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('borderColor'))
  }
}
