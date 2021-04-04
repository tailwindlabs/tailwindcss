import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('backdropGrayscale'), (value, modifier) => {
        return [
          nameClass('backdrop-grayscale', modifier),
          {
            '--tw-backdrop-grayscale': Array.isArray(value)
              ? value.map((v) => `grayscale(${v})`).join(' ')
              : `grayscale(${value})`,
          },
        ]
      })
    )

    addUtilities(utilities, variants('backdropGrayscale'))
  }
}
