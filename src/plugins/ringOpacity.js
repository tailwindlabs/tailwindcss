import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(_.omit(theme('ringOpacity'), 'DEFAULT'), (value, modifier) => {
        return [
          nameClass('ring-opacity', modifier),
          {
            '--tw-ring-opacity': value,
          },
        ]
      })
    )
    addUtilities(utilities, variants('ringOpacity'))
  }
}
