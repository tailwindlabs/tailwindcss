import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('sepia'), (value, modifier) => {
        return [
          nameClass('sepia', modifier),
          {
            '--tw-sepia': Array.isArray(value)
              ? value.map((v) => `sepia(${v})`).join(' ')
              : `sepia(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('sepia'))
  }
}
