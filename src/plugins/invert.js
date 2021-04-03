import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('invert'), (value, modifier) => {
        return [
          nameClass('invert', modifier),
          {
            '--tw-invert': Array.isArray(value)
              ? value.map((v) => `invert(${v})`).join(' ')
              : `invert(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('invert'))
  }
}
