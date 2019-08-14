import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, config, variants }) {
    const utilities = _.fromPairs(
      _.map(config('theme.boxShadow'), (value, modifier) => {
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
