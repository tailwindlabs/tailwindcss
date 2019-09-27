import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('textShadow'), (value, modifier) => {
        const className =
          modifier === 'default' ? 'text-shadow' : `${e(prefixNegativeModifiers('text-shadow', modifier))}`
        return [
          `.${className}`,
          {
            'text-shadow': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('textShadow'))
  }
}
