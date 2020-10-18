import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backgroundSize'), (value, modifier) => {
        return [
          nameClass('bg', modifier),
          {
            'background-size': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backgroundSize'))
  }
}
