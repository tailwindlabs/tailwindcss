import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('zIndex'), (value, modifier) => {
        const className =
          modifier === 'default' ? 'z' : `${e(prefixNegativeModifiers('z', modifier))}`
        return [
          `.${className}`,
          {
            'z-index': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('zIndex'))
  }
}
