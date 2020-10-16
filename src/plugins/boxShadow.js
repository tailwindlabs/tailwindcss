import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function() {
  return function({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('boxShadow'), (value, modifier) => {
        return [
          nameClass('shadow', modifier),
          {
            'box-shadow': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('boxShadow'))
  }
}
