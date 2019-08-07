import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(flattenColorPalette(theme('placeholderPosition')), (value, modifier) => {
        return [
          `.${e(`placeholder-${modifier}`)}::placeholder`,
          {
            'text-align': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('placeholderPosition'))
  }
}
