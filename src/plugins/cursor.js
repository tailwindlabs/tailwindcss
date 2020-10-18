import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('cursor'), (value, modifier) => {
        return [
          nameClass('cursor', modifier),
          {
            cursor: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('cursor'))
  }
}
