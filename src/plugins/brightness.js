import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('brightness'), (value, modifier) => {
        return [
          nameClass('brightness', modifier),
          {
            '--tw-brightness': Array.isArray(value)
              ? value.map((v) => `brightness(${v})`).join(' ')
              : `brightness(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('brightness'))
  }
}
