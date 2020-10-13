import _ from 'lodash'
import usesCustomProperties from '../util/usesCustomProperties'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
    const utilities = _.fromPairs(
      _.map(flattenColorPalette(theme('backgroundImage')), (value, modifier) => {
        if (target('backgroundImage') === 'ie11' && usesCustomProperties(value)) {
          return []
        }

        return [
          `.${e(`bg-${modifier}`)}`,
          {
            'background-image': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backgroundImage'))
  }
}
