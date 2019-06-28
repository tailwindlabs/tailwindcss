import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, theme, variants, e }) {
    const utilities = _.fromPairs(
      _.map(theme('letterSpacing'), (value, modifier) => {
        const className =
          modifier === 'default'
            ? 'tracking'
            : `${e(prefixNegativeModifiers('tracking', modifier))}`
        return [
          `.${className}`,
          {
            'letter-spacing': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('letterSpacing'))
  }
}
