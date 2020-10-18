import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backgroundImage'), (value, modifier) => {
        return [
          nameClass('bg', modifier),
          {
            'background-image': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backgroundImage'))
  }
}
