import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(flattenColorPalette(theme('backgroundColor')), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backgroundColor'))
  }
}
