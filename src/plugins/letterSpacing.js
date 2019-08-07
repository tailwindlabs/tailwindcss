import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, theme, variants, e }) {
    const utilities = _.fromPairs(
      _.map(theme('letterSpacing'), (value, modifier) => {
        return [
          `.${e(prefixNegativeModifiers('tracking', modifier))}`,
          {
            'letter-spacing': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('letterSpacing'))
  }
}
