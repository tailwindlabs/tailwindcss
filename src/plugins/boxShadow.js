import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('boxShadow'), (value, modifier) => {
        const className =
          modifier === 'default' ? 'shadow' : `${e(prefixNegativeModifiers('shadow', modifier))}`
        return [
          `.${className}`,
          {
            'box-shadow': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('boxShadow'))
  }
}
