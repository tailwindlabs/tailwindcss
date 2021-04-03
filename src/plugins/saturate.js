import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('saturate'), (value, modifier) => {
        return [
          nameClass('saturate', modifier),
          {
            '--tw-saturate': Array.isArray(value)
              ? value.map((v) => `saturate(${v})`).join(' ')
              : `saturate(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('saturate'))
  }
}
