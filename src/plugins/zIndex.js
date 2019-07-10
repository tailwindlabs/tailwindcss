import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('zIndex'), (value, modifier) => {
        return [
          `.${e(prefixNegativeModifiers('z', modifier))}`,
          {
            'z-index': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('zIndex'))
  }
}
