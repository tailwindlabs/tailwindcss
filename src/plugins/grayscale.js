import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('grayscale'), (value, modifier) => {
        return [
          nameClass('grayscale', modifier),
          {
            '--tw-grayscale': Array.isArray(value)
              ? value.map((v) => `grayscale(${v})`).join(' ')
              : `grayscale(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('grayscale'))
  }
}
