import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('divideOpacity'), (value, modifier) => {
        return [
          `${nameClass('divide-opacity', modifier)} > :not([hidden]) ~ :not([hidden])`,
          {
            '--tw-divide-opacity': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('divideOpacity'))
  }
}
