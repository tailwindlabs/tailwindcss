import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('flex'), (value, modifier) => {
        return [
          nameClass('flex', modifier),
          {
            flex: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('flex'))
  }
}
