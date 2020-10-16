import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backgroundPosition'), (value, modifier) => {
        return [
          nameClass('bg', modifier),
          {
            'background-position': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backgroundPosition'))
  }
}
