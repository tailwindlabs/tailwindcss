import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('contrast'), (value, modifier) => {
        return [
          nameClass('contrast', modifier),
          {
            '--tw-contrast': Array.isArray(value)
              ? value.map((v) => `contrast(${v})`).join(' ')
              : `contrast(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('contrast'))
  }
}
